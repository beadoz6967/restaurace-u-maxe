import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// PATCH /api/orders/[id] — update an order's status (kitchen marks "done").
// Gated by the shared kitchen secret so only the kitchen can mutate orders.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (req.headers.get('X-Kitchen-Token') !== process.env.KITCHEN_PIN) {
    return NextResponse.json({ error: 'Neautorizováno.' }, { status: 401 })
  }

  const { id } = await params
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Neplatné ID.' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 })
  }

  const status = (body as { status?: unknown }).status
  if (status !== 'new' && status !== 'done') {
    return NextResponse.json({ error: 'Neplatný stav.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: 'Chyba při aktualizaci objednávky.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}

// DELETE /api/orders/[id] — permanently remove a COMPLETED order (owner clearing
// out finished history). The `.eq('status', 'done')` guard means active orders
// can never be deleted through this path, so a cleanup can't wipe an order still
// being prepared. Gated by the shared kitchen secret.
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (req.headers.get('X-Kitchen-Token') !== process.env.KITCHEN_PIN) {
    return NextResponse.json({ error: 'Neautorizováno.' }, { status: 401 })
  }

  const { id } = await params
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Neplatné ID.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .delete()
    .eq('id', id)
    .eq('status', 'done')

  if (error) {
    return NextResponse.json(
      { error: 'Chyba při mazání objednávky.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
