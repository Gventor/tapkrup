'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { Business, Page } from '@/types/database.types'
import BlockSelector from '@/components/blocks/BlockSelector'
import ContactBlock from '@/components/blocks/editors/ContactBlock'
import LocationBlock from '@/components/blocks/editors/LocationBlock'
import BusinessHoursBlock from '@/components/blocks/editors/BusinessHoursBlock'
import HeadingTextBlock from '@/components/blocks/editors/HeadingTextBlock'
import HeadingLinkBlock from '@/components/blocks/editors/HeadingLinkBlock'
import MessagingBlock from '@/components/blocks/editors/MessagingBlock'
import PriceListBlock from '@/components/blocks/editors/PriceListBlock'
import MenuBlock from '@/components/blocks/editors/MenuBlock'
import PhotoGalleryBlock from '@/components/blocks/editors/PhotoGalleryBlock'
import SocialMediaBlock from '@/components/blocks/editors/SocialMediaBlock'

export default function EditPageForm({ params }: { params: { id: string; pageId: string } }) {
  const [business, setBusiness] = useState<Business | null>(null)
  const [page, setPage] = useState<Page | null>(null)
  const [title, setTitle] = useState('')
  const [subSlug, setSubSlug] = useState('')
  const [isMain, setIsMain] = useState(false)
  const [blocks, setBlocks] = useState<Array<{ id?: string; type: string; data: any; tempId: string }>>([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    const { data: businessData } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', params.id)
      .single()

    if (businessData) {
      setBusiness(businessData)
    }

    const { data: pageData } = await supabase
      .from('pages')
      .select('*')
      .eq('id', params.pageId)
      .single()

    if (pageData) {
      setPage(pageData)
      setTitle(pageData.title)
      setSubSlug(pageData.sub_slug || '')
      setIsMain(pageData.is_main)
    }

    const { data: blocksData } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_id', params.pageId)
      .order('display_order', { ascending: true })

    if (blocksData) {
      setBlocks(blocksData.map(block => ({
        id: block.id,
        type: block.block_type,
        data: block.data,
        tempId: block.id,
      })))
    }
  }

  const generateSlug = (titleText: string) => {
    return titleText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '')
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setSubSlug(generateSlug(value))
  }

  const addBlock = (blockType: string) => {
    const newBlock = {
      type: blockType,
      data: {},
      tempId: `temp-${Date.now()}-${Math.random()}`,
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (tempId: string, data: any) => {
    setBlocks(blocks.map(block =>
      block.tempId === tempId ? { ...block, data } : block
    ))
  }

  const moveBlock = (tempId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.tempId === tempId)
    if (index === -1) return

    const newBlocks = [...blocks]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= blocks.length) return

    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
    setBlocks(newBlocks)
  }

  const deleteBlock = (tempId: string) => {
    setBlocks(blocks.filter(block => block.tempId !== tempId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error: pageError } = await supabase
      .from('pages')
      .update({
        title,
        sub_slug: isMain ? null : subSlug,
        is_main: isMain,
      })
      .eq('id', params.pageId)

    if (pageError) {
      setMessage('Error: ' + pageError.message)
      setSaving(false)
      return
    }

    await supabase
      .from('page_blocks')
      .delete()
      .eq('page_id', params.pageId)

    if (blocks.length > 0) {
      const blocksToInsert = blocks.map((block, index) => ({
        page_id: params.pageId,
        block_type: block.type,
        display_order: index,
        data: block.data,
      }))

      const { error: blocksError } = await supabase
        .from('page_blocks')
        .insert(blocksToInsert)

      if (blocksError) {
        setMessage('Error: ' + blocksError.message)
        setSaving(false)
        return
      }
    }

    setMessage('Saved successfully!')
    setSaving(false)
    loadData()
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this page? This cannot be undone.')) {
      return
    }

    setDeleting(true)
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', params.pageId)

    if (error) {
      setMessage('Error: ' + error.message)
      setDeleting(false)
    } else {
      router.push(`/dashboard/business/${params.id}`)
    }
  }

  if (!business || !page) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>

  const renderBlockEditor = (block: any, index: number) => {
    const commonProps = {
      data: block.data,
      onChange: (data: any) => updateBlock(block.tempId, data),
      onMoveUp: () => moveBlock(block.tempId, 'up'),
      onMoveDown: () => moveBlock(block.tempId, 'down'),
      onDelete: () => deleteBlock(block.tempId),
      canMoveUp: index > 0,
      canMoveDown: index < blocks.length - 1,
    }

    switch (block.type) {
      case 'contact':
        return <ContactBlock key={block.tempId} {...commonProps} />
      case 'location':
        return <LocationBlock key={block.tempId} {...commonProps} />
      case 'business_hours':
        return <BusinessHoursBlock key={block.tempId} {...commonProps} />
      case 'heading_text':
        return <HeadingTextBlock key={block.tempId} {...commonProps} />
      case 'heading_link':
        return <HeadingLinkBlock key={block.tempId} {...commonProps} />
      case 'messaging':
        return <MessagingBlock key={block.tempId} {...commonProps} />
      case 'price_list':
        return <PriceListBlock key={block.tempId} {...commonProps} />
      case 'menu':
        return <MenuBlock key={block.tempId} {...commonProps} />
      case 'photo_gallery':
        return <PhotoGalleryBlock key={block.tempId} {...commonProps} />
      case 'social_media':
        return <SocialMediaBlock key={block.tempId} {...commonProps} />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Link href={`/dashboard/business/${params.id}`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Button>
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Edit Page</h1>
            <p className="text-gray-600 mt-1">{business.name} - {page.title}</p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Deleting...' : 'Delete Page'}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Home, Restaurant, Spa, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub_slug">URL Slug (Auto-Generated)</Label>
                <Input
                  id="sub_slug"
                  value={subSlug}
                  readOnly
                  className="bg-white"
                  placeholder="home"
                />
                <p className="text-sm text-blue-600 font-medium">
                  {isMain 
                    ? `Will be shown at: /${business.slug}` 
                    : `Will be shown at: /${business.slug}/${subSlug || '...'}`
                  }
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_main"
                  checked={isMain}
                  onChange={(e) => setIsMain(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_main" className="cursor-pointer">
                  Set as main page (will be shown at /{business.slug})
                </Label>
              </div>
            </div>
          </Card>

          {/* Content Blocks */}
          <div className="space-y-4">
            {blocks.map((block, index) => renderBlockEditor(block, index))}
          </div>

          {/* Add Block Button */}
          <BlockSelector onSelectBlock={addBlock} />

          {message && (
            <div className={`p-3 rounded-md ${message.includes('Error') ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            </div>
          )}

          <div className="sticky bottom-4 bg-white border-2 border-gray-200 rounded-lg p-4 shadow-lg">
            <Button type="submit" className="w-full h-12 text-lg" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
