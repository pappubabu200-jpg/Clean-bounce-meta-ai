package main

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/pappubabu200-jpg/Clean-bounce-meta-ai/api/internal/auth"
	"github.com/pappubabu200-jpg/Clean-bounce-meta-ai/api/internal/billing"
	"github.com/pappubabu200-jpg/Clean-bounce-meta-ai/api/internal/dns"
	"github.com/pappubabu200-jpg/Clean-bounce-meta-ai/api/internal/smtp"
	"github.com/redis/go-redis/v9"
	"github.com/stripe/stripe-go/v76"
)

var rdb *redis.Client
var emailRegex = regexp.MustCompile(`[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}`)

func main() {
	godotenv.Load()

	rdb = redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_URL"),
	})

	billing.Init(os.Getenv("STRIPE_SECRET_KEY"))

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-API-Key")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Public routes
	r.POST("/api/auth/signup", signupHandler)
	r.POST("/api/stripe/webhook", webhookHandler)
	r.POST("/api/tools/extract", extractHandler)
	r.GET("/api/tools/dns/:domain", dnsHandler)

	// Protected routes
	protected := r.Group("/")
	protected.Use(auth.AuthMiddleware(rdb))
	{
		protected.GET("/api/usage", usageHandler)
		protected.POST("/api/billing/checkout", checkoutHandler)
		protected.POST("/api/tools/clean", cleanHandler)
		protected.POST("/api/bulk/upload", bulkUploadHandler)
		protected.GET("/api/bulk/status/:id", bulkStatusHandler)
		protected.GET("/api/bulk/download/:id", bulkDownloadHandler)
		protected.POST("/api/report/bounce", reportBounceHandler)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("API running on :%s", port)
	r.Run(":" + port)
}

func signupHandler(c *gin.Context) {
	email := c.PostForm("email")
	if email == "" {
		c.JSON(400, gin.H{"error": "email required"})
		return
	}
	key := auth.GenerateAPIKey()
	ctx := context.Background()
	rdb.Set(ctx, "key:"+key, email, 0)
	rdb.HSet(ctx, "user:"+email, "plan", "free", "created", time.Now().Unix())
	c.JSON(200, gin.H{"api_key": key})
}

func usageHandler(c *gin.Context) {
	userID := c.GetString("user_id")
	ctx := context.Background()
	plan, _ := rdb.HGet(ctx, "user:"+userID, "plan").Result()
	cleanUsed, _ := rdb.Get(ctx, "rl:clean:"+userID).Int()
	extractUsed, _ := rdb.Get(ctx, "rl:extract:"+userID).Int()
	
	cleanLimit := 100
	if plan == "pro" {
		cleanLimit = 10000
	}
	
	c.JSON(200, gin.H{
		"plan": plan,
		"clean_used": cleanUsed,
		"clean_limit": cleanLimit,
		"extract_used": extractUsed,
		"extract_limit": 5000,
	})
}

func checkoutHandler(c *gin.Context) {
	userID := c.GetString("user_id")
	sess, err := billing.CreateCheckoutSession(
		userID,
		os.Getenv("STRIPE_PRICE_ID"),
		"http://localhost:3000/dashboard?success=1",
		"http://localhost:3000/pricing",
	)
	if err!= nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"url": sess.URL})
}

func webhookHandler(c *gin.Context) {
	payload, _ := io.ReadAll(c.Request.Body)
	sig := c.GetHeader("Stripe-Signature")
	event, err := billing.VerifyWebhook(payload, sig, os.Getenv("STRIPE_WEBHOOK_SECRET"))
	if err!= nil {
		c.JSON(400, gin.H{"error": "invalid signature"})
		return
	}

	if event.Type == "checkout.session.completed" {
		var sess stripe.CheckoutSession
		json.Unmarshal(event.Data.Raw, &sess)
		userID := sess.Metadata["user_id"]
		ctx := context.Background()
		rdb.HSet(ctx, "user:"+userID, "plan", "pro")
	}
	c.JSON(200, gin.H{"received": true})
}

type ExtractReq struct {
	Text string `json:"text"`
	URL string `json:"url"`
}

func extractHandler(c *gin.Context) {
	var req ExtractReq
	if err := c.BindJSON(&req); err!= nil {
		c.JSON(400, gin.H{"error": "invalid json"})
		return
	}

	ip := c.ClientIP()
	content := req.Text
	if req.URL!= "" {
		content = fetchURL(req.URL)
	}

	key := "rl:extract:" + ip
	ctx := context.Background()
	used, _ := rdb.Get(ctx, key).Int()
	if used+len(content) > 5000 {
		c.JSON(429, gin.H{"error": "Daily limit 5K chars exceeded"})
		return
	}
	rdb.IncrBy(ctx, key, int64(len(content)))
	rdb.Expire(ctx, key, 24*time.Hour)

	matches := emailRegex.FindAllString(content, -1)
	unique := make(map[string]bool)
	for _, e := range matches {
		unique[strings.ToLower(e)] = true
	}

	var emails []string
	for e := range unique {
		emails = append(emails, e)
	}

	c.JSON(200, gin.H{
		"emails": emails[:min(50, len(emails))],
		"total": len(emails),
	})
}

type CleanReq struct {
	Emails []string `json:"emails"`
}

func cleanHandler(c *gin.Context) {
	userID := c.GetString("user_id")
	ctx := context.Background()
	plan, _ := rdb.HGet(ctx, "user:"+userID, "plan").Result()
	
	limit := 100
	if plan == "pro" {
		limit = 10000
	}
	// In cleanHandler, after limit check:
credits, _ := rdb.HGet(ctx, "user:"+userID, "credits").Int()
if credits < len(req.Emails) {
	c.JSON(402, gin.H{"error": "insufficient credits"})
	return
}
rdb.HIncrBy(ctx, "user:"+userID, "credits", -len(req.Emails))

	var req CleanReq
	c.BindJSON(&req)
	
	key := "rl:clean:" + userID
	count, _ := rdb.Get(ctx, key).Int()
	if count+len(req.Emails) > limit {
		c.JSON(429, gin.H{"error": fmt.Sprintf("Daily limit %d exceeded", limit)})
		return
	}
	rdb.IncrBy(ctx, key, int64(len(req.Emails)))
	rdb.Expire(ctx, key, 24*time.Hour)

	results := []smtp.Result{}
	validCount := 0

	for _, e := range req.Emails {
		res := smtp.Verify(e)
		results = append(results, res)
		if res.Valid {
			validCount++
		}
		time.Sleep(100 * time.Millisecond)
	}

	c.JSON(200, gin.H{
		"total": len(req.Emails),
		"valid": validCount,
		"invalid": len(req.Emails) - validCount,
		"results": results[:min(20, len(results))],
	})
}

type BulkJob struct {
	ID string `json:"id"`
	Status string `json:"status"`
	Total int `json:"total"`
	Processed int `json:"processed"`
	Valid int `json:"valid"`
}

func bulkUploadHandler(c *gin.Context) {
	file, err := c.FormFile("file")
	if err!= nil {
		c.JSON(400, gin.H{"error": "no file"})
		return
	}

	f, _ := file.Open()
	defer f.Close()
	reader := csv.NewReader(f)
	emails := []string{}
	for {
		record, err := reader.Read()
		if err == io.EOF { break }
		if len(record) > 0 { emails = append(emails, record[0]) }
	}

	if len(emails) > 10000 {
		c.JSON(400, gin.H{"error": "max 10k emails"})
		return
	}

	jobID := uuid.New().String()
	ctx := context.Background()
	rdb.HSet(ctx, "job:"+jobID, "status", "pending", "total", len(emails), "processed", 0, "valid", 0)
	
	for _, e := range emails {
		rdb.LPush(ctx, "queue:"+jobID, e)
	}
	
	go processJob(jobID)
	c.JSON(200, gin.H{"job_id": jobID, "total": len(emails)})
}
type BounceReport struct {
	Email string `json:"email"`
	JobID string `json:"job_id"`
}

func reportBounceHandler(c *gin.Context) {
	userID := c.GetString("user_id")
	var req BounceReport
	c.BindJSON(&req)
	
	ctx := context.Background()
	// Check if we marked it valid in that job
	key := "result:" + req.JobID
	data, _ := rdb.HGet(ctx, key, req.Email).Result()
	if strings.HasPrefix(data, "true|") {
		// We said valid but it bounced = refund 10 credits
		rdb.HIncrBy(ctx, "user:"+userID, "credits", 10)
		c.JSON(200, gin.H{"refunded": 10, "reason": "false_positive"})
		return
	}
	c.JSON(400, gin.H{"error": "email not found or was marked invalid"})
}

func processJob(jobID string) {
	ctx := context.Background()
	rdb.HSet(ctx, "job:"+jobID, "status", "processing")
	
	for {
		email, err := rdb.RPop(ctx, "queue:"+jobID).Result()
		if err!= nil { break }
		
		res := smtp.Verify(email)
		if res.Valid {
			rdb.HIncrBy(ctx, "job:"+jobID, "valid", 1)
		}
		rdb.HIncrBy(ctx, "job:"+jobID, "processed", 1)
		rdb.HSet(ctx, "result:"+jobID, email, fmt.Sprintf("%t|%s", res.Valid, res.Reason))
		time.Sleep(100 * time.Millisecond)
	}
	rdb.HSet(ctx, "job:"+jobID, "status", "done")
	rdb.HSet(ctx, "user:"+email, "credits", 100) // 100 free credits
}

func bulkStatusHandler(c *gin.Context) {
	jobID := c.Param("id")
	ctx := context.Background()
	job, _ := rdb.HGetAll(ctx, "job:"+jobID).Result()
	if len(job) == 0 {
		c.JSON(404, gin.H{"error": "job not found"})
		return
	}
	c.JSON(200, job)
}

func bulkDownloadHandler(c *gin.Context) {
	jobID := c.Param("id")
	ctx := context.Background()
	results, _ := rdb.HGetAll(ctx, "result:"+jobID).Result()
	
	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", "attachment; filename=verified.csv")
	writer := csv.NewWriter(c.Writer)
	writer.Write([]string{"email", "valid", "reason"})
	for email, data := range results {
		parts := strings.Split(data, "|")
		writer.Write([]string{email, parts[0], parts[1]})
	}
	writer.Flush()
}

func dnsHandler(c *gin.Context) {
	domain := c.Param("domain")
	res := dns.Check(domain)
	c.JSON(200, res)
}

func fetchURL(url string) string {
	client := http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get(url)
	if err!= nil {
		return ""
	}
	defer resp.Body.Close()

	buf := make([]byte, 1024*100)
	n, _ := resp.Body.Read(buf)
	return string(buf[:n])
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
