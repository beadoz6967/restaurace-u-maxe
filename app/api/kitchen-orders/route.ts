import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { pragueDayStartISO } from '@/lib/time'

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

// GET /api/kitchen-orders — today's open orders for the kitchen board. Reads
// run through the service-role client so the `orders` table never needs an
// anon SELECT policy (which would expose customer PII to anyone with the
// public anon key). Gated by the shared kitchen secret.
export async function GET(req: Request) {
  if (req.headers.get('X-Kitchen-Token') !== process.env.KITCHEN_PIN) {
    return NextResponse.json({ error: 'Neautorizováno.' }, { status: 401 })
  }

  const since = pragueDayStartISO()
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .gte('created_at', since)
    .eq('status', 'new')
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
