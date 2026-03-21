'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bike, Lock, Plus, Pencil, Trash2, Save, X } from 'lucide-react'

interface Bike {
  id: string
  bike_id: string
  plate_number: string | null
  model: string | null
  status: string
  price_per_day: number
  odometer_km: number | null
}

interface Rental {
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
  nfc_code: string | null
}

interface BikesBlockDisplayProps {
  businessId: string
  blockId: string
  data: { manage_password_hash?: string }
}

export default function BikesBlockDisplay({ businessId, blockId, data }: BikesBlockDisplayProps) {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loaded, setLoaded] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isManaging, setIsManaging] = useState(false)

  const [showAddBike, setShowAddBike] = useState(false)
  const [showAddRental, setShowAddRental] = useState(false)
  const [editingBike, setEditingBike] = useState<Bike | null>(null)
  const [editingRental, setEditingRental] = useState<Rental | null>(null)

  const loadBikes = async () => {
    const res = await fetch(`/api/bikes?businessId=${businessId}`)
    const data = await res.json()
    if (res.ok) setBikes(data)
  }

  const loadRentals = async () => {
    const res = await fetch(`/api/rentals?businessId=${businessId}`)
    const data = await res.json()
    if (res.ok) setRentals(data)
  }

  useEffect(() => {
    loadBikes().then(() => setLoaded(true))
    loadRentals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId])

  const handleManageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    const res = await fetch('/api/bikes-manage-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blockId, password }),
    })
    const json = await res.json()
    if (!res.ok) {
      setPasswordError(json.error || 'Incorrect password')
      return
    }
    setIsManaging(true)
    setManageOpen(false)
    setPassword('')
    loadBikes()
    loadRentals()
  }

  const hasManagePassword = !!data.manage_password_hash

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Bike className="h-5 w-5 text-[var(--tapkrup-navy)]" />
        Bikes
      </h3>

      {!loaded ? (
        <p className="text-gray-500">Loading...</p>
      ) : bikes.length === 0 && !isManaging ? (
        <p className="text-gray-500 mb-4">No bikes yet.</p>
      ) : (
        <div className="space-y-3 mb-4">
          {bikes.map((bike) => (
            <div
              key={bike.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div>
                <p className="font-semibold">{bike.bike_id} {bike.model ? `- ${bike.model}` : ''}</p>
                <p className="text-sm text-gray-600">
                  ฿{Number(bike.price_per_day).toLocaleString()}/day
                  {bike.status !== 'available' && (
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      bike.status === 'rented' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200'
                    }`}>
                      {bike.status}
                    </span>
                  )}
                </p>
              </div>
              {isManaging && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingBike(bike)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={async () => {
                      if (!confirm('Delete this bike?')) return
                      await fetch(`/api/bikes/${bike.id}?blockId=${blockId}`, { method: 'DELETE' })
                      loadBikes()
                      loadRentals()
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isManaging && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              className="gap-1 bg-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy-dark)]"
              onClick={() => { setShowAddBike(true); setShowAddRental(false); setEditingBike(null); setEditingRental(null) }}
            >
              <Plus className="h-4 w-4" /> New Bike
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => { setShowAddRental(true); setShowAddBike(false); setEditingBike(null); setEditingRental(null) }}
            >
              <Plus className="h-4 w-4" /> New Rental
            </Button>
          </div>

          {showAddBike && <AddBikeForm blockId={blockId} businessId={businessId} onSaved={() => { setShowAddBike(false); loadBikes() }} onCancel={() => setShowAddBike(false)} />}
          {editingBike && <EditBikeForm blockId={blockId} bike={editingBike} onSaved={() => { setEditingBike(null); loadBikes() }} onCancel={() => setEditingBike(null)} />}

          {showAddRental && <AddRentalForm blockId={blockId} bikes={bikes} onSaved={() => { setShowAddRental(false); loadBikes(); loadRentals() }} onCancel={() => setShowAddRental(false)} />}

          {rentals.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Rentals</h4>
              <div className="space-y-2">
                {rentals.map((r) => (
                  <div key={r.id} className="flex justify-between items-center p-3 border rounded bg-gray-50">
                    <div className="text-sm">
                      <span className="font-medium">{r.bikes?.bike_id} - {r.customer_name}</span>
                      <span className="text-gray-500 ml-2">{r.start_date} to {r.end_date}</span>
                      {r.nfc_code && <span className="text-xs text-blue-600 ml-2">/{r.nfc_code}</span>}
                    </div>
                    {isManaging && (
                      <Button size="sm" variant="outline" onClick={() => setEditingRental(r)}>
                        Edit
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {editingRental && <EditRentalForm blockId={blockId} rental={editingRental} bikes={bikes} onSaved={() => { setEditingRental(null); loadBikes(); loadRentals() }} onCancel={() => setEditingRental(null)} />}
        </div>
      )}

      {hasManagePassword && !isManaging && (
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full gap-2 border-[var(--tapkrup-navy)] text-[var(--tapkrup-navy)]"
            onClick={() => setManageOpen(true)}
          >
            <Lock className="h-4 w-4" /> Manage
          </Button>
        </div>
      )}

      {manageOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm p-6">
            <h3 className="font-bold text-lg mb-4">Enter password to manage</h3>
            <form onSubmit={handleManageSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-[var(--tapkrup-navy)]">Enter</Button>
                <Button type="button" variant="outline" onClick={() => { setManageOpen(false); setPassword(''); setPasswordError('') }}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </Card>
  )
}

function AddBikeForm({
  blockId,
  businessId,
  onSaved,
  onCancel,
}: {
  blockId: string
  businessId: string
  onSaved: () => void
  onCancel: () => void
}) {
  const [bike_id, setBike_id] = useState('')
  const [plate_number, setPlate_number] = useState('')
  const [model, setModel] = useState('')
  const [price_per_day, setPrice_per_day] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/bikes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blockId,
        businessId,
        bike_id,
        plate_number: plate_number || undefined,
        model: model || undefined,
        price_per_day: price_per_day || 0,
      }),
    })
    setSaving(false)
    if (res.ok) onSaved()
  }

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <h4 className="font-semibold mb-3">New Bike</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label>Bike ID *</Label>
          <Input value={bike_id} onChange={(e) => setBike_id(e.target.value)} placeholder="B001" required />
        </div>
        <div>
          <Label>Plate</Label>
          <Input value={plate_number} onChange={(e) => setPlate_number(e.target.value)} />
        </div>
        <div>
          <Label>Model</Label>
          <Input value={model} onChange={(e) => setModel(e.target.value)} />
        </div>
        <div>
          <Label>Price/day (฿)</Label>
          <Input type="number" value={price_per_day} onChange={(e) => setPrice_per_day(e.target.value)} placeholder="0" />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={saving}>Save</Button>
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

function EditBikeForm({
  blockId,
  bike,
  onSaved,
  onCancel,
}: {
  blockId: string
  bike: Bike
  onSaved: () => void
  onCancel: () => void
}) {
  const [bike_id, setBike_id] = useState(bike.bike_id)
  const [plate_number, setPlate_number] = useState(bike.plate_number || '')
  const [model, setModel] = useState(bike.model || '')
  const [status, setStatus] = useState(bike.status)
  const [price_per_day, setPrice_per_day] = useState(String(bike.price_per_day))
  const [odometer_km, setOdometer_km] = useState(String(bike.odometer_km || ''))
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/bikes/${bike.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blockId,
        bike_id,
        plate_number: plate_number || undefined,
        model: model || undefined,
        status,
        price_per_day: price_per_day || 0,
        odometer_km: odometer_km ? Number(odometer_km) : undefined,
      }),
    })
    setSaving(false)
    if (res.ok) onSaved()
  }

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <h4 className="font-semibold mb-3">Edit Bike</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div><Label>Bike ID *</Label><Input value={bike_id} onChange={(e) => setBike_id(e.target.value)} required /></div>
        <div><Label>Plate</Label><Input value={plate_number} onChange={(e) => setPlate_number(e.target.value)} /></div>
        <div><Label>Model</Label><Input value={model} onChange={(e) => setModel(e.target.value)} /></div>
        <div>
          <Label>Status</Label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-md px-3 py-2">
            <option value="available">available</option>
            <option value="rented">rented</option>
            <option value="maintenance">maintenance</option>
          </select>
        </div>
        <div><Label>Price/day (฿)</Label><Input type="number" value={price_per_day} onChange={(e) => setPrice_per_day(e.target.value)} /></div>
        <div><Label>Odometer KM</Label><Input type="number" value={odometer_km} onChange={(e) => setOdometer_km(e.target.value)} /></div>
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={saving} className="gap-1"><Save className="h-4 w-4" /> Save</Button>
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

function AddRentalForm({
  blockId,
  bikes,
  onSaved,
  onCancel,
}: {
  blockId: string
  bikes: Bike[]
  onSaved: () => void
  onCancel: () => void
}) {
  const [bike_id, setBike_id] = useState('')
  const [customer_name, setCustomer_name] = useState('')
  const [phone, setPhone] = useState('')
  const [start_date, setStart_date] = useState('')
  const [end_date, setEnd_date] = useState('')
  const [deposit, setDeposit] = useState('')
  const [km_start, setKm_start] = useState('')
  const [saving, setSaving] = useState(false)

  const availableBikes = bikes.filter((b) => b.status === 'available')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blockId,
        bike_id,
        customer_name,
        phone: phone || undefined,
        start_date,
        end_date,
        deposit: deposit || 0,
        km_start: km_start || undefined,
      }),
    })
    const json = await res.json()
    setSaving(false)
    if (res.ok) {
      if (json.nfc_code) {
        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/b/${json.nfc_code}`
        prompt('Share this link with customer for NFC:', url)
      }
      onSaved()
    }
  }

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <h4 className="font-semibold mb-3">New Rental</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label>Bike *</Label>
          <select value={bike_id} onChange={(e) => setBike_id(e.target.value)} required className="w-full border rounded-md px-3 py-2">
            <option value="">Select bike</option>
            {availableBikes.map((b) => (
              <option key={b.id} value={b.id}>{b.bike_id} {b.model ? `- ${b.model}` : ''}</option>
            ))}
          </select>
        </div>
        <div><Label>Customer name *</Label><Input value={customer_name} onChange={(e) => setCustomer_name(e.target.value)} required /></div>
        <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Start date *</Label><Input type="date" value={start_date} onChange={(e) => setStart_date(e.target.value)} required /></div>
          <div><Label>End date *</Label><Input type="date" value={end_date} onChange={(e) => setEnd_date(e.target.value)} required /></div>
        </div>
        <div><Label>Deposit (฿)</Label><Input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} /></div>
        <div><Label>KM at start</Label><Input type="number" value={km_start} onChange={(e) => setKm_start(e.target.value)} /></div>
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={saving}>Save</Button>
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

function EditRentalForm({
  blockId,
  rental,
  bikes,
  onSaved,
  onCancel,
}: {
  blockId: string
  rental: Rental
  bikes: Bike[]
  onSaved: () => void
  onCancel: () => void
}) {
  const [customer_name, setCustomer_name] = useState(rental.customer_name)
  const [phone, setPhone] = useState(rental.phone || '')
  const [start_date, setStart_date] = useState(rental.start_date)
  const [end_date, setEnd_date] = useState(rental.end_date)
  const [deposit, setDeposit] = useState(String(rental.deposit))
  const [km_start, setKm_start] = useState(rental.km_start != null ? String(rental.km_start) : '')
  const [km_end, setKm_end] = useState(rental.km_end != null ? String(rental.km_end) : '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/rentals/${rental.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blockId,
        customer_name,
        phone: phone || undefined,
        start_date,
        end_date,
        deposit: deposit || 0,
        km_start: km_start ? Number(km_start) : undefined,
        km_end: km_end ? Number(km_end) : undefined,
      }),
    })
    setSaving(false)
    if (res.ok) onSaved()
  }

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <h4 className="font-semibold mb-3">Edit Rental</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div><Label>Customer name *</Label><Input value={customer_name} onChange={(e) => setCustomer_name(e.target.value)} required /></div>
        <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Start date *</Label><Input type="date" value={start_date} onChange={(e) => setStart_date(e.target.value)} required /></div>
          <div><Label>End date *</Label><Input type="date" value={end_date} onChange={(e) => setEnd_date(e.target.value)} required /></div>
        </div>
        <div><Label>Deposit (฿)</Label><Input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>KM start</Label><Input type="number" value={km_start} onChange={(e) => setKm_start(e.target.value)} /></div>
          <div><Label>KM end</Label><Input type="number" value={km_end} onChange={(e) => setKm_end(e.target.value)} placeholder="When returned" /></div>
        </div>
        {rental.nfc_code && <p className="text-xs text-gray-500">Link: /b/{rental.nfc_code}</p>}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={saving} className="gap-1"><Save className="h-4 w-4" /> Save</Button>
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}
