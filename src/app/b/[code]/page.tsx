import { supabase } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NfcRedirectPage({ params }: { params: { code: string } }) {
  const { data: nfcLink } = await supabase
    .from('nfc_links')
    .select(`
      page_id,
      pages (
        sub_slug,
        business_id,
        businesses (
          slug
        )
      )
    `)
    .eq('code', params.code)
    .single()

  if (nfcLink?.pages) {
    const page = nfcLink.pages as { sub_slug?: string; business_id?: string; businesses?: { slug?: string } }
    const business = page.businesses as { slug?: string } | undefined

    if (business?.slug) {
      if (page.sub_slug) {
        redirect(`/${business.slug}/${page.sub_slug}`)
      } else {
        redirect(`/${business.slug}`)
      }
    }
  }

  const { data: bikeRental } = await supabase
    .from('rentals')
    .select('id, nfc_code, bikes (business_id)')
    .eq('nfc_code', params.code)
    .single()

  if (bikeRental?.nfc_code) {
    const bike = bikeRental.bikes as { business_id?: string } | null
    if (bike?.business_id) {
      const { data: b } = await supabase.from('businesses').select('slug').eq('id', bike.business_id).single()
      if (b?.slug) redirect(`/${b.slug}/bikerentals/${params.code}`)
    }
    redirect(`/rental/${params.code}`)
  }

  const { data: villaRental } = await supabase
    .from('villa_rentals')
    .select('id, nfc_code, villas (business_id)')
    .eq('nfc_code', params.code)
    .single()

  if (villaRental?.nfc_code) {
    const villa = villaRental.villas as { business_id?: string } | null
    if (villa?.business_id) {
      const { data: b } = await supabase.from('businesses').select('slug').eq('id', villa.business_id).single()
      if (b?.slug) redirect(`/${b.slug}/villarentals/${params.code}`)
    }
    redirect(`/villa/${params.code}`)
  }

  notFound()
}
