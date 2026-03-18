'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Business, Page } from '@/types/database.types'
import Link from 'next/link'
import { ArrowLeft, Plus, ExternalLink, Edit, Copy } from 'lucide-react'
import Image from 'next/image'

export default function BusinessPagesPage({ params }: { params: { id: string } }) {
  const [business, setBusiness] = useState<Business | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const router = useRouter()

  const copyPageLink = (page: Page) => {
    if (typeof window === 'undefined') return
    const url = page.sub_slug 
      ? `${window.location.origin}/${business?.slug}/${page.sub_slug}`
      : `${window.location.origin}/${business?.slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(page.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  useEffect(() => {
    loadBusiness()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const loadBusiness = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: businessData } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!businessData) {
      router.push('/dashboard')
      return
    }

    setBusiness(businessData)

    const { data: pagesData } = await supabase
      .from('pages')
      .select('*')
      .eq('business_id', params.id)
      .order('created_at', { ascending: true })

    if (pagesData) {
      setPages(pagesData)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!business) return null

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Business Header */}
        <div className="flex items-center gap-4">
          {business.logo_url && (
            <div className="relative w-20 h-20">
              <Image
                src={business.logo_url}
                alt={business.name}
                width={80}
                height={80}
                className="rounded-lg object-contain w-full h-full"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <p className="text-gray-600">/{business.slug}</p>
          </div>
          <Link href={`/${business.slug}`} target="_blank">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Public
            </Button>
          </Link>
        </div>

        {/* Add Page Button */}
        <Link href={`/dashboard/business/${business.id}/page/new`}>
          <Button className="w-full sm:w-auto h-12 gap-2" size="lg">
            <Plus className="h-5 w-5" />
            Add New Page
          </Button>
        </Link>

        {/* Pages List */}
        {pages.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pages yet</h3>
            <p className="text-gray-600 mb-6">Create your first page to get started</p>
            <Link href={`/dashboard/business/${business.id}/page/new`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Page
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card key={page.id} className="p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{page.title}</h3>
                    <p className="text-sm text-gray-600">
                      /{business.slug}{page.sub_slug ? `/${page.sub_slug}` : ''}
                    </p>
                  </div>
                  {page.is_main && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Main</span>
                  )}
                </div>
                

                <div className="flex gap-2">
                  <Link href={`/dashboard/business/${business.id}/page/${page.id}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2" size="sm">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant={copiedId === page.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => copyPageLink(page)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Link href={`/${business.slug}${page.sub_slug ? `/${page.sub_slug}` : ''}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
