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

  if (!nfcLink || !nfcLink.pages) {
    notFound()
  }

  const page = nfcLink.pages as any
  const business = page.businesses as any

  if (!business?.slug) {
    notFound()
  }

  if (page.sub_slug) {
    redirect(`/${business.slug}/${page.sub_slug}`)
  } else {
    redirect(`/${business.slug}`)
  }
}
