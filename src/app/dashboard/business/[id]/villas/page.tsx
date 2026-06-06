'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Plus, Home, Edit, Trash2, Copy } from 'lucide-react'
import { formatDate, formatThb, formatThbInput, parseThbInput, handleThbInputChange, getPublicUrl } from '@/lib/utils'
import QrLinkButton from '@/components/QrLinkButton'

interface Villa {
  id: string
  name: string
  address: string | null
  beds: number | null
  description: string | null
}

interface VillaRental {
  id: string
  villa_id: string
  villas: { name: string } | null
  start_date: string
  end_date: string
  rent_amount: number | null
  deposit: number | null
  tenant_name: string | null
  tenant_phone: string | null
  tenant_email: string | null
  tenant_id_number: string | null
  agent_phone: string | null
  agent_line: string | null
  agent_whatsapp: string | null
  agent_telegram: string | null
  agent_wechat: string | null
  notes: string | null
  nfc_code: string | null
}

export default function VillasPage({ params }: { params: { id: string } }) {
  const [business, setBusiness] = useState<{ id: string; name: string; slug: string } | null>(null)
  const [villas, setVillas] = useState<Villa[]>([])
  const [rentals, setRentals] = useState<VillaRental[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddVilla, setShowAddVilla] = useState(false)
  const [showAddRental, setShowAddRental] = useState(false)
  const [editingVilla, setEditingVilla] = useState<Villa | null>(null)
  const [editingRental, setEditingRental] = useState<VillaRental | null>(null)
  const [addRentalVillaId, setAddRentalVillaId] = useState<string | null>(null)
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

    const { data: v } = await supabase
      .from('villas')
      .select('*')
      .eq('business_id', params.id)
      .order('name')

    setVillas(v || [])

    const villaIds = (v || []).map((x) => x.id)
    if (villaIds.length > 0) {
      const { data: r } = await supabase
        .from('villa_rentals')
        .select('*, villas(name)')
        .in('villa_id', villaIds)
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

  const getNfcPath = (code: string) => `/${business?.slug}/villarentals/${code}`

  const copyNfcLink = (code: string) => {
    if (typeof window === 'undefined' || !business) return
    const url = getPublicUrl(getNfcPath(code), window.location.origin)
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
            <Home className="h-6 w-6 text-[var(--tapkrup-navy)]" />
            Villa Rentals
          </h1>
          <Button
            className="gap-2 bg-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy-dark)]"
            onClick={() => { setShowAddVilla(true); setShowAddRental(false); setEditingVilla(null); setEditingRental(null) }}
          >
            <Plus className="h-4 w-4" /> New Villa
          </Button>
        </div>

        {showAddVilla && <VillaForm businessId={params.id} onSaved={() => { setShowAddVilla(false); load() }} onCancel={() => setShowAddVilla(false)} />}
        {editingVilla && <VillaForm businessId={params.id} villa={editingVilla} onSaved={() => { setEditingVilla(null); load() }} onCancel={() => setEditingVilla(null)} />}

        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">Villas</h2>
          {villas.length === 0 ? (
            <p className="text-gray-500">No villas yet. Add one to get started.</p>
          ) : (
            <div className="space-y-3">
              {villas.map((v) => (
                <div key={v.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    {v.address && <p className="text-sm text-gray-600">{v.address}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditingVilla(v); setShowAddVilla(false); setShowAddRental(false); setEditingRental(null) }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={async () => { if (confirm('Delete this villa?')) { await supabase.from('villas').delete().eq('id', v.id); load() } }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={() => { setShowAddRental(true); setEditingRental(null); setEditingVilla(null); setAddRentalVillaId(v.id) }}>
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
          <Button size="sm" variant="outline" className="mb-4" onClick={() => { setShowAddRental(true); setEditingRental(null); setAddRentalVillaId(null) }}>
            <Plus className="h-4 w-4 mr-1" /> New Rental
          </Button>
          {(showAddRental || editingRental) && (
            <RentalForm
              businessId={params.id}
              villas={villas}
              preselectedVillaId={addRentalVillaId}
              rental={editingRental}
              onSaved={() => { setShowAddRental(false); setEditingRental(null); setAddRentalVillaId(null); load() }}
              onCancel={() => { setShowAddRental(false); setEditingRental(null); setAddRentalVillaId(null) }}
            />
          )}
          {rentals.length === 0 ? (
            <p className="text-gray-500">No rentals yet.</p>
          ) : (
            <div className="space-y-3">
              {rentals.map((r) => (
                <div key={r.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <div>
                    <p className="font-semibold">{(r.villas as { name: string })?.name} – {r.tenant_name || 'Tenant'}</p>
                    <p className="text-sm text-gray-600">{formatDate(r.start_date)} to {formatDate(r.end_date)}{r.rent_amount != null && r.rent_amount > 0 ? ` · ${formatThb(r.rent_amount)}` : ''}</p>
                    {r.nfc_code && <span className="text-xs text-blue-600">/{r.nfc_code}</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyNfcLink(r.nfc_code!)} disabled={!r.nfc_code}>
                      <Copy className="h-4 w-4" /> {copiedCode === r.nfc_code ? 'Copied' : 'Link'}
                    </Button>
                    <QrLinkButton
                      path={r.nfc_code ? getNfcPath(r.nfc_code) : ''}
                      title={`${(r.villas as { name: string })?.name || 'Villa'} rental`}
                      disabled={!r.nfc_code}
                    />
                    <Button size="sm" variant="outline" onClick={() => { setEditingRental(r); setShowAddRental(true); setAddRentalVillaId(null) }}>
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

function VillaForm({
  businessId,
  villa,
  onSaved,
  onCancel,
}: {
  businessId: string
  villa?: Villa | null
  onSaved: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState(villa?.name || '')
  const [address, setAddress] = useState(villa?.address || '')
  const [beds, setBeds] = useState(villa?.beds ? String(villa.beds) : '')
  const [description, setDescription] = useState(villa?.description || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (villa) {
      await supabase.from('villas').update({ name, address: address || null, beds: beds ? parseInt(beds, 10) : null, description: description || null }).eq('id', villa.id)
    } else {
      await supabase.from('villas').insert({ business_id: businessId, name, address: address || null, beds: beds ? parseInt(beds, 10) : null, description: description || null })
    }
    setSaving(false)
    onSaved()
  }

  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <h3 className="font-bold mb-4">{villa ? 'Edit Villa' : 'New Villa'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><Label>Villa name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
        <div><Label>Beds</Label><Input type="number" value={beds} onChange={(e) => setBeds(e.target.value)} /></div>
        <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

function RentalForm({
  businessId,
  villas,
  preselectedVillaId,
  rental,
  onSaved,
  onCancel,
}: {
  businessId: string
  villas: Villa[]
  preselectedVillaId?: string | null
  rental?: VillaRental | null
  onSaved: () => void
  onCancel: () => void
}) {
  const preselectedVilla = villas.find((v) => v.id === (rental?.villa_id || preselectedVillaId))
  const [villaName, setVillaName] = useState(preselectedVilla?.name || (rental?.villas as { name?: string })?.name || '')
  const [start_date, setStart_date] = useState(rental?.start_date || '')
  const [end_date, setEnd_date] = useState(rental?.end_date || '')
  const [rent_amount, setRent_amount] = useState(formatThbInput(rental?.rent_amount ?? null))
  const [deposit, setDeposit] = useState(formatThbInput(rental?.deposit ?? null))
  const [tenant_name, setTenant_name] = useState(rental?.tenant_name || '')
  const [tenant_phone, setTenant_phone] = useState(rental?.tenant_phone || '')
  const [tenant_email, setTenant_email] = useState(rental?.tenant_email || '')
  const [tenant_id_number, setTenant_id_number] = useState(rental?.tenant_id_number || '')
  const [agent_phone, setAgent_phone] = useState(rental?.agent_phone || '')
  const [agent_line, setAgent_line] = useState(rental?.agent_line || '')
  const [agent_whatsapp, setAgent_whatsapp] = useState(rental?.agent_whatsapp || '')
  const [agent_telegram, setAgent_telegram] = useState(rental?.agent_telegram || '')
  const [agent_wechat, setAgent_wechat] = useState(rental?.agent_wechat || '')
  const [notes, setNotes] = useState(rental?.notes || '')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const v = villas.find((x) => x.id === (rental?.villa_id || preselectedVillaId))
    setVillaName(v?.name || (rental?.villas as { name?: string })?.name || '')
    setRent_amount(formatThbInput(rental?.rent_amount ?? null))
    setDeposit(formatThbInput(rental?.deposit ?? null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rental?.villa_id, rental?.rent_amount, rental?.deposit, preselectedVillaId, villas])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)
    const nameTrim = villaName.trim()
    if (!nameTrim) {
      setSaveError('Please enter villa name')
      return
    }
    setSaving(true)
    let villa_id: string
    const existing = villas.find((v) => v.name.toLowerCase() === nameTrim.toLowerCase())
    if (existing) {
      villa_id = existing.id
    } else {
      const { data: newVilla, error: villaErr } = await supabase.from('villas').insert({ business_id: businessId, name: nameTrim }).select('id').single()
      if (villaErr || !newVilla) {
        setSaving(false)
        setSaveError(villaErr?.message || 'Could not create villa')
        return
      }
      villa_id = newVilla.id
    }
    const nfc_code = rental?.nfc_code || ('v_' + Math.random().toString(36).slice(2, 11))
    const payload = {
      villa_id,
      start_date,
      end_date,
      rent_amount: parseThbInput(rent_amount),
      deposit: parseThbInput(deposit),
      tenant_name: tenant_name || null,
      tenant_phone: tenant_phone || null,
      tenant_email: tenant_email || null,
      tenant_id_number: tenant_id_number || null,
      agent_phone: agent_phone || null,
      agent_line: agent_line || null,
      agent_whatsapp: agent_whatsapp || null,
      agent_telegram: agent_telegram || null,
      agent_wechat: agent_wechat || null,
      notes: notes || null,
    }
    const { error } = rental
      ? await supabase.from('villa_rentals').update(payload).eq('id', rental.id)
      : await supabase.from('villa_rentals').insert({ ...payload, nfc_code })
    setSaving(false)
    if (error) {
      setSaveError(error.message + (error.code ? ` (${error.code})` : ''))
      return
    }
    onSaved()
  }

  return (
    <Card className="p-6 bg-amber-50 border-amber-200 mb-4">
      <h3 className="font-bold mb-4">{rental ? 'Edit Rental' : 'New Rental'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {saveError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{saveError}</p>}
        <div>
          <Label>Villa *</Label>
          <Input
            value={villaName}
            onChange={(e) => setVillaName(e.target.value)}
            placeholder="Enter villa name (e.g. Villa A1)"
            required
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Start date *</Label><Input type="date" value={start_date} onChange={(e) => { const v = e.target.value; setStart_date(v); if (end_date && v > end_date) setEnd_date(v); }} required /></div>
          <div><Label>End date *</Label><Input type="date" value={end_date} onChange={(e) => setEnd_date(e.target.value)} min={start_date || undefined} required /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Rent amount (THB)</Label><Input type="text" inputMode="numeric" value={rent_amount} onChange={(e) => handleThbInputChange(e.target.value, setRent_amount)} placeholder="e.g. 75,000" /></div>
          <div><Label>Deposit (THB)</Label><Input type="text" inputMode="numeric" value={deposit} onChange={(e) => handleThbInputChange(e.target.value, setDeposit)} placeholder="e.g. 10,000" /></div>
        </div>
        <h4 className="font-semibold text-sm">Tenant (admin only)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Name</Label><Input value={tenant_name} onChange={(e) => setTenant_name(e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={tenant_phone} onChange={(e) => setTenant_phone(e.target.value)} /></div>
          <div><Label>Email</Label><Input type="email" value={tenant_email} onChange={(e) => setTenant_email(e.target.value)} /></div>
          <div><Label>ID number</Label><Input value={tenant_id_number} onChange={(e) => setTenant_id_number(e.target.value)} /></div>
        </div>
        <h4 className="font-semibold text-sm">Agent contact (shown to guest)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><Label>Phone</Label><Input value={agent_phone} onChange={(e) => setAgent_phone(e.target.value)} placeholder="+66812345678" /></div>
          <div><Label>LINE</Label><Input value={agent_line} onChange={(e) => setAgent_line(e.target.value)} placeholder="https://line.me/ti/p/..." /></div>
          <div><Label>WhatsApp</Label><Input value={agent_whatsapp} onChange={(e) => setAgent_whatsapp(e.target.value)} placeholder="66812345678" /></div>
          <div><Label>Telegram</Label><Input value={agent_telegram} onChange={(e) => setAgent_telegram(e.target.value)} placeholder="https://t.me/..." /></div>
          <div><Label>WeChat</Label><Input value={agent_wechat} onChange={(e) => setAgent_wechat(e.target.value)} placeholder="https://weixin.qq.com/..." /></div>
        </div>
        <div><Label>Notes (admin only)</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}
