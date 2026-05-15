package main

import (
	"github.com/pappubabu200-jpg/Clean-bounce-meta-ai/api/internal/smtp"
	"context"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client
var emailRegex = regexp.MustCompile(`[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}`)

func main() {
	godotenv.Load()
	
	rdb = redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_URL"),
	})

	r := gin.Default()
	
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.POST("/api/tools/extract", extractHandler)
	r.POST("/api/tools/clean", cleanHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("API running on :%s", port)
	r.Run(":" + port)
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
	var req CleanReq
	if err := c.BindJSON(&req); err!= nil {
		c.JSON(400, gin.H{"error": "invalid json"})
		return
	}

	ip := c.ClientIP()
	key := "rl:clean:" + ip
	ctx := context.Background()
	
	count, _ := rdb.Get(ctx, key).Int()
	if count+len(req.Emails) > 500 {
		c.JSON(429, gin.H{"error": "Daily limit 500 emails exceeded"})
		return
	}
	rdb.IncrBy(ctx, key, int64(len(req.Emails)))
	rdb.Expire(ctx, key, 24*time.Hour)

	var valid, invalid []string
	for _, e := range req.Emails {
		if emailRegex.MatchString(e) {
			valid = append(valid, e)
		} else {
			invalid = append(invalid, e)
		}
	}

	c.JSON(200, gin.H{
		"total": len(req.Emails),
		"valid": len(valid),
		"invalid": len(invalid),
		"sample_invalid": invalid[:min(5, len(invalid))],
	})
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
func cleanHandler(c *gin.Context) {
	var req CleanReq
	if err := c.BindJSON(&req); err!= nil {
		c.JSON(400, gin.H{"error": "invalid json"})
		return
	}

	ip := c.ClientIP()
	key := "rl:clean:" + ip
	ctx := context.Background()
	
	count, _ := rdb.Get(ctx, key).Int()
	if count+len(req.Emails) > 100 { // Pro: 100 full verifies/day free
		c.JSON(429, gin.H{"error": "Daily limit 100 full verifications exceeded"})
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
		time.Sleep(100 * time.Millisecond) // Don't hammer servers
	}

	c.JSON(200, gin.H{
		"total": len(req.Emails),
		"valid": validCount,
		"invalid": len(req.Emails) - validCount,
		"results": results[:min(20, len(results))], // Show first 20
	})
}
