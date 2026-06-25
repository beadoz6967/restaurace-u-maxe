import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isBeforeOrderCutoff } from '@/lib/time'

interface IncomingItem {
  name: string
  quantity: number
  price: number
}

interface OrderPayload {
  customerName: string
  customerPhone: string
  items: IncomingItem[]
  total: number
}

// Field caps — reject oversized / abusive payloads outright.
const MAX_NAME = 100
const MAX_PHONE = 20
const MAX_ITEMS = 20
const MAX_ITEM_NAME = 200

function isValidPayload(body: unknown): body is OrderPayload {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  if (
    typeof b.customerName !== 'string' ||
    b.customerName.trim() === '' ||
    b.customerName.length > MAX_NAME
  )
    return false
  if (
    typeof b.customerPhone !== 'string' ||
    b.customerPhone.trim() === '' ||
    b.customerPhone.length > MAX_PHONE
  )
    return false
  if (typeof b.total !== 'number' || b.total <= 0) return false
  if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > MAX_ITEMS)
    return false
  return b.items.every((item) => {
    if (typeof item !== 'object' || item === null) return false
    const i = item as Record<string, unknown>
    return (
      typeof i.name === 'string' &&
      i.name.length <= MAX_ITEM_NAME &&
      typeof i.quantity === 'number' &&
      i.quantity > 0 &&
      typeof i.price === 'number'
    )
  })
}

// POST /api/orders — validate, enforce the 10:00 Prague cutoff, persist.
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 })
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: 'Neplatná objednávka.' }, { status: 400 })
  }

  if (!isBeforeOrderCutoff()) {
    return NextResponse.json(
      { error: 'Objednávky jsou uzavřeny po 10:00.' },
      { status: 403 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_name: body.customerName.trim(),
      customer_phone: body.customerPhone.trim(),
      // Pickup time was removed from the form; all takeaway is collected at
      // noon, so the column carries a fixed label for the kitchen board.
      pickup_time: 'V poledne',
      items: body.items,
      total: body.total,
      status: 'new',
    })
    .select('id')
    .single<{ id: string }>()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Chyba při ukládání objednávky.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}
