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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get('businessId')
  if (!businessId) {
    return NextResponse.json({ error: 'businessId required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bikes')
    .select('*')
    .eq('business_id', businessId)
    .order('bike_id', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blockId, businessId, bike_id, plate_number, model, status, price_per_day, odometer_km } = body

    if (!blockId || !businessId || !bike_id) {
      return NextResponse.json({ error: 'blockId, businessId and bike_id required' }, { status: 400 })
    }

    if (!getManageCookie(request, blockId)) {
      return NextResponse.json({ error: 'Unauthorized - enter Manage password first' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('bikes')
      .insert({
        business_id: businessId,
        bike_id: bike_id.trim(),
        plate_number: plate_number?.trim() || null,
        model: model?.trim() || null,
        status: status || 'available',
        price_per_day: Number(price_per_day) || 0,
        odometer_km: Number(odometer_km) || 0,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
