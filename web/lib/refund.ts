// web/lib/refund.ts
import { Redis } from '@upstash/redis'
const redis = new Redis({ 
  url: process.env.UPSTASH_REDIS_REST_URL!, 
  token: process.env.UPSTASH_REDIS_REST_TOKEN! 
})

// Log every verification
export async function logVerify(email: string, result: string, userId: string) {
  const key = `verify:${userId}:${Date.now()}`
  await redis.set(key, JSON.stringify({ email, result, ts: Date.now() }), { ex: 86400 * 30 }) // 30 days
}

// Report bounce + auto refund
export async function reportBounce(email: string, userId: string) {
  const keys = await redis.keys(`verify:${userId}:*`)
  for (const key of keys) {
    const data = await redis.get(key)
    if (data?.email === email && data?.result === 'valid') {
      await redis.incrby(`credits:${userId}`, 10) // 10x refund
      await redis.del(key) // Prevent double refund
      return { refunded: 10, success: true }
    }
  }
  return { refunded: 0, success: false }
        }
