'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Bike } from 'lucide-react'

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
  data?: { manage_password_hash?: string }
}

export default function BikesBlockDisplay({ businessId }: BikesBlockDisplayProps) {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/bikes?businessId=${businessId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBikes(data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId])

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
        <div className="space-y-3">
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
    </Card>
  )
}
