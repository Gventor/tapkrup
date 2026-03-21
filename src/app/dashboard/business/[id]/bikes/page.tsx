'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Plus, Bike, Edit, Trash2, Copy } from 'lucide-react'

interface Bike {
  id: string
  bike_id: string
  plate_number: string | null
  model: string | null
  status: string
  price_per_day: number
  odometer_km: number | null
}

interface BikeRental {
  id: string
  bike_id: string
  bikes?: { bike_id: string; model: string | null }
  customer_name: string
  phone: string | null
  start_date: string
  end_date: string
  deposit: number
  km_start: number | null
  km_end: number | null
  agent_phone: string | null
  agent_line: string | null
  agent_whatsapp: string | null
  nfc_code: string | null
}

export default function BikesPage({ params }: { params: { id: string } }) {
  const [business, setBusiness] = useState<{ id: string; name: string; slug: string } | null>(null)
  const [bikes, setBikes] = useState<Bike[]>([])
  const [rentals, setRentals] = useState<BikeRental[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddBike, setShowAddBike] = useState(false)
  const [showAddRental, setShowAddRental] = useState(false)
  const [editingBike, setEditingBike] = useState<Bike | null>(null)
  const [editingRental, setEditingRental] = useState<BikeRental | null>(null)
  const [addRentalBikeId, setAddRentalBikeId] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const router = useRouter()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: b } = await supabase
      .from('businesses')
      .select('id, name, slug')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!b) {
      router.push('/dashboard')
      return
    }
    setBusiness(b)

    const { data: bikeData } = await supabase
      .from('bikes')
      .select('*')
      .eq('business_id', params.id)
      .order('bike_id')

    setBikes(bikeData || [])

    const bikeIds = (bikeData || []).map((x) => x.id)
    if (bikeIds.length > 0) {
      const { data: r } = await supabase
        .from('rentals')
        .select('*, bikes(bike_id, model)')
        .in('bike_id', bikeIds)
        .order('start_date', { ascending: false })
      setRentals(r || [])
    } else {
      setRentals([])
    }

    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const copyNfcLink = (code: string) => {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/b/${code}`
    navigator.clipboard.writeText(url)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  if (!business) return null

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Link href={`/dashboard/business/${params.id}`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bike className="h-6 w-6 text-[var(--tapkrup-navy)]" />
            Bike Rentals
          </h1>
          <Button
            className="gap-2 bg-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy-dark)]"
            onClick={() => { setShowAddBike(true); setShowAddRental(false); setEditingBike(null); setEditingRental(null) }}
          >
            <Plus className="h-4 w-4" /> New Bike
          </Button>
        </div>

        {showAddBike && <BikeForm businessId={params.id} onSaved={() => { setShowAddBike(false); load() }} onCancel={() => setShowAddBike(false)} />}
        {editingBike && <BikeForm businessId={params.id} bike={editingBike} onSaved={() => { setEditingBike(null); load() }} onCancel={() => setEditingBike(null)} />}

        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">Bikes</h2>
          {bikes.length === 0 ? (
            <p className="text-gray-500">No bikes yet. Add one to get started.</p>
          ) : (
            <div className="space-y-3">
              {bikes.map((b) => (
                <div key={b.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <div>
                    <p className="font-semibold">{b.bike_id} {b.model ? `- ${b.model}` : ''}</p>
                    <p className="text-sm text-gray-600">฿{Number(b.price_per_day).toLocaleString()}/day · {b.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditingBike(b); setShowAddBike(false); setShowAddRental(false); setEditingRental(null) }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={async () => { if (confirm('Delete this bike?')) { await supabase.from('bikes').delete().eq('id', b.id); load() } }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={() => { setShowAddRental(true); setEditingRental(null); setEditingBike(null); setAddRentalBikeId(b.id) }}>
                      <Plus className="h-4 w-4" /> Rental
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">Rentals</h2>
          <Button size="sm" variant="outline" className="mb-4" onClick={() => { setShowAddRental(true); setEditingRental(null); setAddRentalBikeId(null) }}>
            <Plus className="h-4 w-4 mr-1" /> New Rental
          </Button>
          {(showAddRental || editingRental) && (
            <RentalForm
              bikes={bikes}
              preselectedBikeId={addRentalBikeId}
              rental={editingRental}
              onSaved={() => { setShowAddRental(false); setEditingRental(null); setAddRentalBikeId(null); load() }}
              onCancel={() => { setShowAddRental(false); setEditingRental(null); setAddRentalBikeId(null) }}
            />
          )}
          {rentals.length === 0 ? (
            <p className="text-gray-500">No rentals yet.</p>
          ) : (
            <div className="space-y-3">
              {rentals.map((r) => (
                <div key={r.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <div>
                    <p className="font-semibold">{(r.bikes as { bike_id: string; model?: string })?.bike_id} – {r.customer_name}</p>
                    <p className="text-sm text-gray-600">{r.start_date} to {r.end_date}</p>
                    {r.nfc_code && <span className="text-xs text-blue-600">/{r.nfc_code}</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyNfcLink(r.nfc_code!)} disabled={!r.nfc_code}>
                      <Copy className="h-4 w-4" /> {copiedCode === r.nfc_code ? 'Copied' : 'Link'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditingRental(r); setShowAddRental(true); setAddRentalBikeId(null) }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}

function BikeForm({
  businessId,
  bike,
  onSaved,
  onCancel,
}: {
  businessId: string
  bike?: Bike | null
  onSaved: () => void
  onCancel: () => void
}) {
  const [bike_id, setBike_id] = useState(bike?.bike_id || '')
  const [plate_number, setPlate_number] = useState(bike?.plate_number || '')
  const [model, setModel] = useState(bike?.model || '')
  const [status, setStatus] = useState(bike?.status || 'available')
  const [price_per_day, setPrice_per_day] = useState(bike ? String(bike.price_per_day) : '')
  const [odometer_km, setOdometer_km] = useState(bike?.odometer_km != null ? String(bike.odometer_km) : '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      bike_id: bike_id.trim(),
      plate_number: plate_number || null,
      model: model || null,
      status,
      price_per_day: Number(price_per_day) || 0,
      odometer_km: odometer_km ? Number(odometer_km) : null,
    }
    if (bike) {
      await supabase.from('bikes').update(payload).eq('id', bike.id)
    } else {
      await supabase.from('bikes').insert({ business_id: businessId, ...payload })
    }
    setSaving(false)
    onSaved()
  }

  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <h3 className="font-bold mb-4">{bike ? 'Edit Bike' : 'New Bike'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><Label>Bike ID *</Label><Input value={bike_id} onChange={(e) => setBike_id(e.target.value)} placeholder="B001" required /></div>
        <div><Label>Plate</Label><Input value={plate_number} onChange={(e) => setPlate_number(e.target.value)} /></div>
        <div><Label>Model</Label><Input value={model} onChange={(e) => setModel(e.target.value)} /></div>
        {bike && (
          <div>
            <Label>Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-md px-3 py-2">
              <option value="available">available</option>
              <option value="rented">rented</option>
              <option value="maintenance">maintenance</option>
            </select>
          </div>
        )}
        <div><Label>Price/day (฿)</Label><Input type="number" value={price_per_day} onChange={(e) => setPrice_per_day(e.target.value)} /></div>
        <div><Label>Odometer KM</Label><Input type="number" value={odometer_km} onChange={(e) => setOdometer_km(e.target.value)} /></div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

function RentalForm({
  bikes,
  preselectedBikeId,
  rental,
  onSaved,
  onCancel,
}: {
  bikes: Bike[]
  preselectedBikeId?: string | null
  rental?: BikeRental | null
  onSaved: () => void
  onCancel: () => void
}) {
  const selectedBike = bikes.find((b) => b.id === (rental?.bike_id || preselectedBikeId))
  const [bikeSearch, setBikeSearch] = useState(selectedBike ? `${selectedBike.bike_id}${selectedBike.model ? ` - ${selectedBike.model}` : ''}` : '')
  const [bike_id, setBike_id] = useState(rental?.bike_id || preselectedBikeId || '')
  const [customer_name, setCustomer_name] = useState(rental?.customer_name || '')
  const [phone, setPhone] = useState(rental?.phone || '')
  const [start_date, setStart_date] = useState(rental?.start_date || '')
  const [end_date, setEnd_date] = useState(rental?.end_date || '')
  const [deposit, setDeposit] = useState(rental?.deposit != null ? String(rental.deposit) : '')
  const [km_start, setKm_start] = useState(rental?.km_start != null ? String(rental.km_start) : '')
  const [km_end, setKm_end] = useState(rental?.km_end != null ? String(rental.km_end) : '')
  const [agent_phone, setAgent_phone] = useState(rental?.agent_phone || '')
  const [agent_line, setAgent_line] = useState(rental?.agent_line || '')
  const [agent_whatsapp, setAgent_whatsapp] = useState(rental?.agent_whatsapp || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const bikeUuid = rental?.bike_id || preselectedBikeId
    const b = bikeUuid ? bikes.find((x) => x.id === bikeUuid) : null
    if (b) {
      setBike_id(b.id)
      setBikeSearch(`${b.bike_id}${b.model ? ` - ${b.model}` : ''}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rental?.bike_id, preselectedBikeId])

  const handleBikeInputChange = (value: string) => {
    setBikeSearch(value)
    const match = availableBikes.find((b) => {
      const label = `${b.bike_id}${b.model ? ` - ${b.model}` : ''}`
      return label === value || b.bike_id === value.trim()
    })
    setBike_id(match ? match.id : '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bike_id) return
    setSaving(true)
    const nfc_code = rental?.nfc_code || ('r_' + Math.random().toString(36).slice(2, 11))
    const payload = {
      bike_id,
      customer_name: customer_name.trim(),
      phone: phone || null,
      start_date,
      end_date,
      deposit: Number(deposit) || 0,
      km_start: km_start ? Number(km_start) : null,
      km_end: km_end ? Number(km_end) : null,
      agent_phone: agent_phone || null,
      agent_line: agent_line || null,
      agent_whatsapp: agent_whatsapp || null,
    }
    if (rental) {
      await supabase.from('rentals').update(payload).eq('id', rental.id)
      if (bike_id !== rental.bike_id) {
        const oldBikeUpdate = km_end
          ? { odometer_km: Number(km_end), status: 'available' }
          : { status: 'available' }
        await supabase.from('bikes').update(oldBikeUpdate).eq('id', rental.bike_id)
        await supabase.from('bikes').update({ status: 'rented' }).eq('id', bike_id)
      } else if (km_end && rental.bike_id) {
        await supabase.from('bikes').update({ odometer_km: Number(km_end), status: 'available' }).eq('id', rental.bike_id)
      }
    } else {
      const { data } = await supabase.from('rentals').insert({ ...payload, nfc_code }).select().single()
      if (data) {
        await supabase.from('bikes').update({ status: 'rented' }).eq('id', bike_id)
      }
    }
    setSaving(false)
    onSaved()
  }

  const availableBikes = bikes.filter((b) => b.status === 'available' || b.id === rental?.bike_id)

  return (
    <Card className="p-6 bg-amber-50 border-amber-200 mb-4">
      <h3 className="font-bold mb-4">{rental ? 'Edit Rental' : 'New Rental'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Bike *</Label>
          <Input
            list="bike-list"
            value={bikeSearch}
            onChange={(e) => handleBikeInputChange(e.target.value)}
            placeholder="Enter bike ID (e.g. B001)"
            required
            className="w-full"
          />
          <datalist id="bike-list">
            {availableBikes.map((b) => (
              <option key={b.id} value={`${b.bike_id}${b.model ? ` - ${b.model}` : ''}`} />
            ))}
          </datalist>
        </div>
        <div>
          <Label>Customer name *</Label>
          <Input value={customer_name} onChange={(e) => setCustomer_name(e.target.value)} placeholder="Enter customer name" required />
        </div>
        <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Start date *</Label><Input type="date" value={start_date} onChange={(e) => setStart_date(e.target.value)} required /></div>
          <div><Label>End date *</Label><Input type="date" value={end_date} onChange={(e) => setEnd_date(e.target.value)} required /></div>
        </div>
        <div><Label>Deposit (฿)</Label><Input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>KM start</Label><Input type="number" value={km_start} onChange={(e) => setKm_start(e.target.value)} /></div>
          <div><Label>KM end</Label><Input type="number" value={km_end} onChange={(e) => setKm_end(e.target.value)} placeholder="When returned" /></div>
        </div>
        <h4 className="font-semibold text-sm">Contact (shown to guest)</h4>
        <div className="grid grid-cols-3 gap-4">
          <div><Label>Phone</Label><Input value={agent_phone} onChange={(e) => setAgent_phone(e.target.value)} placeholder="Call" /></div>
          <div><Label>LINE</Label><Input value={agent_line} onChange={(e) => setAgent_line(e.target.value)} /></div>
          <div><Label>WhatsApp</Label><Input value={agent_whatsapp} onChange={(e) => setAgent_whatsapp(e.target.value)} /></div>
        </div>
        {rental?.nfc_code && <p className="text-xs text-gray-500">Link: /b/{rental.nfc_code}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}
