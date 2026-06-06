'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Bike, Phone, MessageCircle, Send, MapPin, Navigation } from 'lucide-react'

interface Bike {
  id: string
  bike_id: string
  plate_number: string | null
  model: string | null
  status: string
  price_per_day: number
  odometer_km: number | null
}

interface BikesBlockDisplayProps {
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

export default function BikesBlockDisplay({ businessId, data = {} }: BikesBlockDisplayProps) {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/bikes?businessId=${businessId}`)
      .then((res) => res.json())
      .then((body) => {
        if (Array.isArray(body)) setBikes(body)
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
        <Bike className="h-5 w-5 text-[var(--tapkrup-navy)]" />
        Bikes
      </h3>

      {!loaded ? (
        <p className="text-gray-500">Loading...</p>
      ) : bikes.length === 0 ? (
        <p className="text-gray-500">No bikes yet.</p>
      ) : (
        <div className="space-y-3 mb-6">
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
              <Link
                href={data.wechat.startsWith('http') ? data.wechat : `https://${data.wechat}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white rounded-xl p-4 font-semibold transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                WeChat
              </Link>
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
