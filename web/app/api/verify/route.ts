// web/app/api/verify/route.ts
import { logVerify } from '@/lib/refund'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')!
  // ... your existing SMTP check code ...
  const result = 'valid' // or 'invalid'
  await logVerify(email, result, 'user123') // add this line
  return NextResponse.json({ valid: result === 'valid' })
}
