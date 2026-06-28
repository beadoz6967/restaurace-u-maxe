import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { pragueDayBoundsISO, pragueTodayYMD } from '@/lib/time'

interface OrderLine {
  name: string
  quantity: number
  price: number
}

interface KitchenOrder {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  pickup_time: string
  items: OrderLine[]
  total: number
  status: 'new' | 'done'
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// GET /api/order-history?date=YYYY-MM-DD — every order for a single Prague day,
// letting the owner review completed orders after "hotovo". Like the kitchen
// board, reads run through the service-role client so the `orders` table never
// needs an anon SELECT policy (which would expose customer PII via the public
// anon key). Gated by the shared kitchen secret.
export async function GET(req: Request) {
  if (req.headers.get('X-Kitchen-Token') !== process.env.KITCHEN_PIN) {
    return NextResponse.json({ error: 'Neautorizováno.' }, { status: 401 })
  }

  const today = pragueTodayYMD()
  const param = new URL(req.url).searchParams.get('date')
  const date = param ?? today

  if (!DATE_RE.test(date)) {
    return NextResponse.json({ error: 'Neplatné datum.' }, { status: 400 })
  }
  // Reject calendar-invalid dates (e.g. 2026-13-40 / 2026-02-30) by checking
  // that the value round-trips through Date.
  if (new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    return NextResponse.json({ error: 'Neplatné datum.' }, { status: 400 })
  }
  if (date > today) {
    return NextResponse.json(
      { error: 'Budoucí datum.' },
      { status: 400 }
    )
  }

  const { start, nextStart } = pragueDayBoundsISO(date)
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .gte('created_at', start)
    .lt('created_at', nextStart)
    .order('created_at', { ascending: true })
    .returns<KitchenOrder[]>()

  if (error) {
    return NextResponse.json(
      { error: 'Chyba při načítání objednávek.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ orders: data ?? [] })
}
