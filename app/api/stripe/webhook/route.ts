import { NextResponse } from 'next/server'

// POST /api/stripe/webhook — Stripe event handler. Implementation in next step.
export async function POST() {
  // TODO: verify signature with STRIPE_WEBHOOK_SECRET, then handle events
  return NextResponse.json({ received: true })
}
