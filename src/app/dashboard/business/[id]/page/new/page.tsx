'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Business, PageBlock } from '@/types/database.types'
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

export default function NewPageForm({ params }: { params: { id: string } }) {
  const [business, setBusiness] = useState<Business | null>(null)
  const [title, setTitle] = useState('')
  const [subSlug, setSubSlug] = useState('')
  const [isMain, setIsMain] = useState(false)
  const [blocks, setBlocks] = useState<Array<{ type: string; data: any; tempId: string }>>([])
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadBusiness()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadBusiness = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', params.id)
      .single()

    if (data) {
      setBusiness(data)
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
    if (usePassword && !password.trim()) {
      setMessage('Error: Please enter a password')
      return
    }
    if (usePassword && password.length < 4) {
      setMessage('Error: Password must be at least 4 characters')
      return
    }
    setSaving(true)
    setMessage('')

    const passwordHash = usePassword && password
      ? await bcrypt.hash(password, 10)
      : null

    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .insert({
        business_id: params.id,
        title,
        sub_slug: isMain ? null : subSlug,
        is_main: isMain,
        password_hash: passwordHash,
      })
      .select()
      .single()

    if (pageError) {
      setMessage('Error: ' + pageError.message)
      setSaving(false)
      return
    }

    if (blocks.length > 0) {
      const blocksToInsert = blocks.map((block, index) => ({
        page_id: pageData.id,
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

    router.push(`/dashboard/business/${params.id}`)
  }

  if (!business) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>

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

        <div>
          <h1 className="text-3xl font-bold">Add New Page</h1>
          <p className="text-gray-600 mt-1">Create a new page for {business.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info - Always Shown */}
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

              <div className="border-t pt-4 mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="use_password"
                    checked={usePassword}
                    onChange={(e) => {
                      setUsePassword(e.target.checked)
                      if (!e.target.checked) setPassword('')
                    }}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="use_password" className="cursor-pointer">
                    Password protect this page (staff only)
                  </Label>
                </div>
                {usePassword && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="page_password">Password</Label>
                    <Input
                      id="page_password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password for staff"
                      minLength={4}
                    />
                    <p className="text-xs text-gray-500">Share this password with staff to let them access this page.</p>
                  </div>
                )}
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
              {saving ? 'Creating Page...' : 'Create Page'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
