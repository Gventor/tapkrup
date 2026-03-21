import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Bike, Calendar, User, Phone } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function RentalViewPage({ params }: { params: { code: string } }) {
  const { data: rental, error } = await supabase
    .from('rentals')
    .select(`
      *,
      bikes (
        bike_id,
        model,
        plate_number,
        price_per_day,
        business_id
      )
    `)
    .eq('nfc_code', params.code)
    .single()

  if (error || !rental) {
    notFound()
  }

  const bike = rental.bikes as { bike_id: string; model?: string; plate_number?: string; business_id: string } | null
  if (!bike) {
    notFound()
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('name')
    .eq('id', bike.business_id)
    .single()

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-lg mx-auto py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Bike className="h-6 w-6 text-[var(--tapkrup-navy)]" />
            Your Rental
          </h1>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Bike className="h-5 w-5 text-[var(--tapkrup-navy)]" />
              <div>
                <p className="font-semibold text-gray-900">{bike.bike_id} {bike.model ? `- ${bike.model}` : ''}</p>
                {bike.plate_number && <p className="text-sm text-gray-500">{bike.plate_number}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-[var(--tapkrup-navy)]" />
              <div>
                <p className="font-semibold text-gray-900">{rental.customer_name}</p>
                {rental.phone && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {rental.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-[var(--tapkrup-navy)]" />
              <div>
                <p className="text-sm text-gray-600">
                  {formatDate(rental.start_date)} – {formatDate(rental.end_date)}
                </p>
              </div>
            </div>

            {rental.deposit > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Deposit: ฿{Number(rental.deposit).toLocaleString()}</p>
              </div>
            )}

            {(rental.km_start != null || rental.km_end != null) && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  KM: {rental.km_start ?? '–'} → {rental.km_end ?? '–'}
                </p>
              </div>
            )}
          </div>

          {business?.name && (
            <p className="mt-6 text-sm text-gray-500 text-center">{business.name}</p>
          )}
          <p className="text-xs text-gray-400 text-center mt-1">Powered by TapKrup</p>
        </Card>
      </div>
    </main>
  )
}
