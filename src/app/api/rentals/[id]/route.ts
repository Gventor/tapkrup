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
    const {
      blockId,
      customer_name,
      phone,
      start_date,
      end_date,
      deposit,
      km_start,
      km_end,
    } = body

    if (!blockId) {
      return NextResponse.json({ error: 'blockId required' }, { status: 400 })
    }

    if (!getManageCookie(request, blockId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates: Record<string, unknown> = {}
    if (customer_name !== undefined) updates.customer_name = customer_name.trim()
    if (phone !== undefined) updates.phone = phone?.trim() || null
    if (start_date !== undefined) updates.start_date = start_date
    if (end_date !== undefined) updates.end_date = end_date
    if (deposit !== undefined) updates.deposit = Number(deposit) || 0
    if (km_start !== undefined) updates.km_start = km_start != null ? Number(km_start) : null
    if (km_end !== undefined) updates.km_end = km_end != null ? Number(km_end) : null

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('rentals')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (km_end != null && data?.bike_id) {
      await admin
        .from('bikes')
        .update({
          odometer_km: Number(km_end),
          status: 'available',
        })
        .eq('id', data.bike_id)
    }

    return NextResponse.json(data)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
