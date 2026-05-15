package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/pappubabu200-jpg/Clean-bounce-meta-ai/api/internal/smtp"
)

type BulkJob struct {
	ID string `json:"id"`
	Status string `json:"status"` // pending, processing, done
	Total int `json:"total"`
	Processed int `json:"processed"`
	Valid int `json:"valid"`
	CreatedAt time.Time `json:"created_at"`
}

func bulkUploadHandler(c *gin.Context) {
	file, err := c.FormFile("file")
	if err!= nil {
		c.JSON(400, gin.H{"error": "no file"})
		return
	}

	f, err := file.Open()
	if err!= nil {
		c.JSON(500, gin.H{"error": "cant read file"})
		return
	}
	defer f.Close()

	reader := csv.NewReader(f)
	emails := []string{}
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if len(record) > 0 {
			emails = append(emails, record[0])
		}
	}

	if len(emails) > 10000 {
		c.JSON(400, gin.H{"error": "max 10k emails per job"})
		return
	}

	jobID := uuid.New().String()
	ctx := context.Background()
	
	// Save job meta
	job := BulkJob{
		ID: jobID,
		Status: "pending",
		Total: len(emails),
		CreatedAt: time.Now(),
	}
	rdb.HSet(ctx, "job:"+jobID, "status", job.Status, "total", job.Total)
	
	// Push emails to queue
	for _, e := range emails {
		rdb.LPush(ctx, "queue:"+jobID, e)
	}
	
	// Trigger worker
	go processJob(jobID)
	
	c.JSON(200, gin.H{"job_id": jobID, "total": len(emails)})
}

func processJob(jobID string) {
	ctx := context.Background()
	rdb.HSet(ctx, "job:"+jobID, "status", "processing")
	
	valid := 0
	processed := 0
	
	for {
		email, err := rdb.RPop(ctx, "queue:"+jobID).Result()
		if err!= nil {
			break // queue empty
		}
		
		res := smtp.Verify(email)
		if res.Valid {
			valid++
		}
		processed++
		
		// Save result
		rdb.HSet(ctx, "result:"+jobID, email, fmt.Sprintf("%t|%s", res.Valid, res.Reason))
		rdb.HIncrBy(ctx, "job:"+jobID, "processed", 1)
		
		// 10 emails/sec to avoid IP ban
		time.Sleep(100 * time.Millisecond)
	}
	
	rdb.HSet(ctx, "job:"+jobID, "status", "done", "valid", valid)
}

func bulkStatusHandler(c *gin.Context) {
	jobID := c.Param("id")
	ctx := context.Background()
	
	job, err := rdb.HGetAll(ctx, "job:"+jobID).Result()
	if err!= nil || len(job) == 0 {
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
