'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Home, Phone, MessageCircle, Send, MapPin, Navigation } from 'lucide-react'

interface Villa {
  id: string
  name: string
  address: string | null
  beds: number | null
  description: string | null
}

interface VillasBlockDisplayProps {
  businessId: string
  blockId?: string
  data?: {
    phone?: string
    whatsapp?: string
    line?: string
    telegram?: string
    wechat?: string
    address?: string
    google_maps?: string
  }
}

export default function VillasBlockDisplay({ businessId, data = {} }: VillasBlockDisplayProps) {
  const [villas, setVillas] = useState<Villa[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/villas?businessId=${businessId}`)
      .then((res) => res.json())
      .then((body) => {
        if (Array.isArray(body)) setVillas(body)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [businessId])

  const whatsappUrl = data.whatsapp
    ? (data.whatsapp.startsWith('http') ? data.whatsapp : `https://wa.me/${data.whatsapp.replace(/\D/g, '')}`)
    : null
  const lineUrl = data.line
    ? (data.line.startsWith('http') ? data.line : `https://line.me/ti/p/~${data.line}`)
    : null
  const telegramUrl = data.telegram
    ? (data.telegram.startsWith('http') ? data.telegram : `https://t.me/${data.telegram.replace('@', '')}`)
    : null

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Home className="h-5 w-5 text-[var(--tapkrup-navy)]" />
        Villas
      </h3>

      {!loaded ? (
        <p className="text-gray-500">Loading...</p>
      ) : villas.length === 0 ? (
        <p className="text-gray-500">No villas yet.</p>
      ) : (
        <div className="space-y-3 mb-6">
          {villas.map((villa) => (
            <div
              key={villa.id}
              className="p-3 border rounded-lg bg-gray-50"
            >
              <p className="font-semibold">{villa.name}</p>
              {villa.address && <p className="text-sm text-gray-600">{villa.address}</p>}
              {villa.beds != null && <p className="text-sm text-gray-500">{villa.beds} bed{villa.beds !== 1 ? 's' : ''}</p>}
            </div>
          ))}
        </div>
      )}

      {(data.phone || whatsappUrl || lineUrl || telegramUrl || data.wechat) && (
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-sm text-gray-700">Contact</h4>
          <div className="space-y-2">
            {data.phone && (
              <Link href={`tel:${data.phone}`} className="block">
                <Button className="w-full h-14 bg-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy-dark)] text-white" size="lg">
                  <Phone className="mr-3 h-5 w-5" />
                  Call
                </Button>
              </Link>
            )}
            {whatsappUrl && (
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full h-14 bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white" size="lg">
                  <MessageCircle className="mr-3 h-5 w-5" />
                  WhatsApp
                </Button>
              </Link>
            )}
            {lineUrl && (
              <Link href={lineUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full h-14 bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white" size="lg">
                  <MessageCircle className="mr-3 h-5 w-5" />
                  LINE
                </Button>
              </Link>
            )}
            {telegramUrl && (
              <Link href={telegramUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full h-14 bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white" size="lg">
                  <Send className="mr-3 h-5 w-5" />
                  Telegram
                </Button>
              </Link>
            )}
            {data.wechat && (
              <div className="bg-[var(--tapkrup-green)] text-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-semibold">WeChat</span>
                </div>
                <p className="text-sm">ID: {data.wechat}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {(data.address || data.google_maps) && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--tapkrup-navy)]" />
            Location
          </h4>
          {data.address && <p className="text-gray-700">{data.address}</p>}
          {data.google_maps && (
            <Link href={data.google_maps} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full h-14 gap-2 bg-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy-dark)] text-white" size="lg">
                <Navigation className="h-5 w-5" />
                Get Directions
              </Button>
            </Link>
          )}
        </div>
      )}
    </Card>
  )
}
