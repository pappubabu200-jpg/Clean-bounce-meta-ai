package auth

import (
	"crypto/rand"
	"encoding/hex"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func GenerateAPIKey() string {
	b := make([]byte, 16)
	rand.Read(b)
	return "cb_" + hex.EncodeToString(b)
}

func AuthMiddleware(rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.GetHeader("X-API-Key")
		if key == "" {
			c.JSON(401, gin.H{"error": "missing API key"})
			c.Abort()
			return
		}
		
		userID, err := rdb.Get(c, "key:"+key).Result()
		if err!= nil {
			c.JSON(401, gin.H{"error": "invalid API key"})
			c.Abort()
			return
		}
		
		c.Set("user_id", userID)
		c.Next()
	}
}
