import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import Image from 'next/image'
import PasswordGate from '@/components/PasswordGate'
import { Card } from '@/components/ui/card'
import ContactBlockDisplay from '@/components/blocks/display/ContactBlockDisplay'
import LocationBlockDisplay from '@/components/blocks/display/LocationBlockDisplay'
import BusinessHoursBlockDisplay from '@/components/blocks/display/BusinessHoursBlockDisplay'
import HeadingTextBlockDisplay from '@/components/blocks/display/HeadingTextBlockDisplay'
import HeadingLinkBlockDisplay from '@/components/blocks/display/HeadingLinkBlockDisplay'
import MessagingBlockDisplay from '@/components/blocks/display/MessagingBlockDisplay'
import PriceListBlockDisplay from '@/components/blocks/display/PriceListBlockDisplay'
import MenuBlockDisplay from '@/components/blocks/display/MenuBlockDisplay'
import PhotoGalleryBlockDisplay from '@/components/blocks/display/PhotoGalleryBlockDisplay'
import SocialMediaBlockDisplay from '@/components/blocks/display/SocialMediaBlockDisplay'
import BikesBlockDisplay from '@/components/blocks/display/BikesBlockDisplay'

export const dynamic = 'force-dynamic'

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!business) {
    notFound()
  }

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .eq('business_id', business.id)
    .order('is_main', { ascending: false })

  const mainPage = pages?.find(p => p.is_main) || pages?.[0]

  if (!mainPage) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-lg mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">{business.name}</h1>
          <p className="text-gray-600">No pages available yet.</p>
        </div>
      </main>
    )
  }

  if (mainPage.password_hash) {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get(`page_auth_${mainPage.id.replace(/-/g, '_')}`)
    if (!authCookie?.value) {
      return (
        <PasswordGate
          pageId={mainPage.id}
          pageTitle={mainPage.title}
          businessName={business.name}
          onSuccess={() => {}}
        />
      )
    }
  }

  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', mainPage.id)
    .order('display_order', { ascending: true })

  const renderBlock = (block: any) => {
    switch (block.block_type) {
      case 'contact':
        return <ContactBlockDisplay key={block.id} data={block.data} />
      case 'location':
        return <LocationBlockDisplay key={block.id} data={block.data} />
      case 'business_hours':
        return <BusinessHoursBlockDisplay key={block.id} data={block.data} />
      case 'heading_text':
        return <HeadingTextBlockDisplay key={block.id} data={block.data} />
      case 'heading_link':
        return <HeadingLinkBlockDisplay key={block.id} data={block.data} />
      case 'messaging':
        return <MessagingBlockDisplay key={block.id} data={block.data} />
      case 'price_list':
        return <PriceListBlockDisplay key={block.id} data={block.data} />
      case 'menu':
        return <MenuBlockDisplay key={block.id} data={block.data} />
      case 'photo_gallery':
        return <PhotoGalleryBlockDisplay key={block.id} data={block.data} />
      case 'social_media':
        return <SocialMediaBlockDisplay key={block.id} data={block.data} />
      case 'bikes':
        return <BikesBlockDisplay key={block.id} businessId={business.id} blockId={block.id} data={block.data || {}} />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-lg mx-auto py-8 sm:py-12 space-y-6">
        {/* Logo and Business Info Card */}
        <Card className="p-0 overflow-hidden">
          {business.logo_url && (
            <div className="w-full h-auto m-0 p-0">
              <div className="relative w-full h-64">
                <Image
                  src={business.logo_url}
                  alt={business.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}
          
          <div className="px-6 py-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              {mainPage.title}
            </h1>
          </div>
        </Card>

        {/* Dynamic Blocks */}
        {blocks && blocks.length > 0 && (
          <div className="space-y-4">
            {blocks.map(block => renderBlock(block))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p className="text-base font-semibold text-gray-700">{business.name}</p>
          <p>Powered by TapKrup</p>
        </div>
      </div>
    </main>
  )
}
