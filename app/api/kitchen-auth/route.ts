import { NextResponse } from 'next/server'

// POST /api/kitchen-auth — verify the kitchen PIN server-side so it never
// reaches the client bundle. Returns { ok: true } on a match.

const MAX_ATTEMPTS = 10
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

// In-memory throttle keyed by client IP. Resets on deploy/restart, which is
// acceptable for a single low-traffic kitchen endpoint.
const attempts = new Map<string, { count: number; first: number }>()

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(req: Request) {
  // Constant 300ms cost on every attempt slows scripted brute-forcing.
  await new Promise((r) => setTimeout(r, 300))

  const ip = clientIp(req)
  const now = Date.now()
  const record = attempts.get(ip)

  if (record && now - record.first < LOCKOUT_MS && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { ok: false, error: 'Příliš mnoho pokusů. Zkuste to později.' },
      { status: 429 }
    )
  }

  let pin: unknown
  try {
    pin = (await req.json()).pin
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  if (typeof pin === 'string' && pin === process.env.KITCHEN_PIN) {
    attempts.delete(ip)
    return NextResponse.json({ ok: true })
  }

  // Record the failed attempt (start a fresh window if the last one expired).
  if (record && now - record.first < LOCKOUT_MS) {
    record.count += 1
  } else {
    attempts.set(ip, { count: 1, first: now })
  }

  return NextResponse.json({ ok: false }, { status: 401 })
}
