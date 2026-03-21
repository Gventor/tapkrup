import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

function getManageCookie(request: NextRequest, blockId: string): boolean {
  const cookieName = `bikes_manage_${blockId.replace(/-/g, '_')}`
  const cookie = request.cookies.get(cookieName)
  return !!cookie?.value
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { blockId, bike_id, plate_number, model, status, price_per_day, odometer_km } = body

    if (!blockId) {
      return NextResponse.json({ error: 'blockId required' }, { status: 400 })
    }

    if (!getManageCookie(request, blockId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates: Record<string, unknown> = {}
    if (bike_id !== undefined) updates.bike_id = bike_id.trim()
    if (plate_number !== undefined) updates.plate_number = plate_number?.trim() || null
    if (model !== undefined) updates.model = model?.trim() || null
    if (status !== undefined) updates.status = status
    if (price_per_day !== undefined) updates.price_per_day = Number(price_per_day) || 0
    if (odometer_km !== undefined) updates.odometer_km = Number(odometer_km) || 0

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('bikes')
      .update(updates)
      .eq('id', params.id)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const blockId = searchParams.get('blockId')
    if (!blockId) {
      return NextResponse.json({ error: 'blockId required' }, { status: 400 })
    }

    if (!getManageCookie(request, blockId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { error } = await admin.from('bikes').delete().eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
