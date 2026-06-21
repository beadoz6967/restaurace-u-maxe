import { NextResponse } from 'next/server'

// POST /api/orders — create an order. Implementation in next step.
export async function POST() {
  // TODO: validate payload, persist to Supabase, broadcast to kitchen
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
