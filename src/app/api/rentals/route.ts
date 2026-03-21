import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase-admin'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)

function getManageCookie(request: NextRequest, blockId: string): boolean {
  const cookieName = `bikes_manage_${blockId.replace(/-/g, '_')}`
  const cookie = request.cookies.get(cookieName)
  return !!cookie?.value
}

function generateNfcCode(): string {
  return 'r_' + Math.random().toString(36).slice(2, 11)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get('businessId')
  if (!businessId) {
    return NextResponse.json({ error: 'businessId required' }, { status: 400 })
  }

  const { data: bikes } = await supabase
    .from('bikes')
    .select('id')
    .eq('business_id', businessId)

  const bikeIds = bikes?.map((b) => b.id) || []
  if (bikeIds.length === 0) {
    return NextResponse.json([])
  }

  const { data, error } = await supabase
    .from('rentals')
    .select(`
      *,
      bikes (bike_id, model, business_id)
    `)
    .in('bike_id', bikeIds)
    .order('start_date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      blockId,
      bike_id,
      customer_name,
      phone,
      start_date,
      end_date,
      deposit,
      km_start,
    } = body

    if (!blockId || !bike_id || !customer_name || !start_date || !end_date) {
      return NextResponse.json({
        error: 'blockId, bike_id, customer_name, start_date and end_date required',
      }, { status: 400 })
    }

    if (!getManageCookie(request, blockId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const nfcCode = generateNfcCode()

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('rentals')
      .insert({
        bike_id,
        customer_name: customer_name.trim(),
        phone: phone?.trim() || null,
        start_date,
        end_date,
        deposit: Number(deposit) || 0,
        km_start: km_start != null ? Number(km_start) : null,
        nfc_code: nfcCode,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { error: bikeError } = await admin
      .from('bikes')
      .update({ status: 'rented' })
      .eq('id', bike_id)

    if (bikeError) {
    }

    return NextResponse.json({ ...data, nfc_code: nfcCode })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
