import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Home, Calendar, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function VillaGuestPage({ params }: { params: { code: string } }) {
  const { data: rental, error } = await supabase
    .from('villa_rentals')
    .select(`
      villa_id,
      start_date,
      end_date,
      next_payment_date,
      agent_phone,
      agent_line,
      agent_whatsapp,
      villas (name)
    `)
    .eq('nfc_code', params.code)
    .single()

  if (error || !rental) {
    notFound()
  }

  const villa = rental.villas as { name?: string } | null
  if (!villa?.name) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-lg mx-auto py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Home className="h-6 w-6 text-[var(--tapkrup-navy)]" />
            {villa.name}
          </h1>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-[var(--tapkrup-navy)]" />
              <div>
                <p className="text-sm text-gray-600">Rental period</p>
                <p className="font-semibold">{formatDate(rental.start_date)} – {formatDate(rental.end_date)}</p>
              </div>
            </div>

            {rental.next_payment_date && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-[var(--tapkrup-navy)]" />
                <div>
                  <p className="text-sm text-gray-600">Next payment date</p>
                  <p className="font-semibold">{formatDate(rental.next_payment_date)}</p>
                </div>
              </div>
            )}

            {(rental.agent_phone || rental.agent_line || rental.agent_whatsapp) && (
            <div className="pt-4">
              <p className="font-semibold text-gray-900 mb-3">Contact agent</p>
              <div className="flex flex-col gap-2">
                {rental.agent_phone && (
                  <Link
                    href={`tel:${rental.agent_phone}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy-dark)] text-white font-semibold transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    Call Agent
                  </Link>
                )}
                {rental.agent_line && (
                  <Link
                    href={rental.agent_line.startsWith('http') ? rental.agent_line : `https://line.me/ti/p/~${rental.agent_line}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white font-semibold transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    LINE
                  </Link>
                )}
                {rental.agent_whatsapp && (
                  <Link
                    href={`https://wa.me/${rental.agent_whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white font-semibold transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </Link>
                )}
              </div>
            </div>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">Powered by TapKrup</p>
        </Card>
      </div>
    </main>
  )
}
