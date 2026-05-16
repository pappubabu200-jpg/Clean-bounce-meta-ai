import { NextRequest, NextResponse } from 'next/server'
import { reportBounce } from '@/lib/refund'

export async function POST(req: NextRequest) {
  const { email, userId } = await req.json()
  const result = await reportBounce(email, userId || 'anon')
  return NextResponse.json(result)
}
