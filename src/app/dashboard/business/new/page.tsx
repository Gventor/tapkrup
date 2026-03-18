'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function NewBusinessPage() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const generateSlug = (businessName: string) => {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '')
      .trim()
  }

  const handleNameChange = (value: string) => {
    setName(value)
    setSlug(generateSlug(value))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Error: Please upload an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage('Error: Image must be less than 2MB')
      return
    }

    setUploading(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `logos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file)

    if (uploadError) {
      setMessage('Error: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath)

    setLogoUrl(publicUrl)
    setMessage('Logo uploaded successfully!')
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: business, error } = await supabase
      .from('businesses')
      .insert({
        user_id: user.id,
        name,
        slug,
        logo_url: logoUrl || null,
      })
      .select()
      .single()

    if (error) {
      setMessage('Error: ' + error.message)
      setSaving(false)
    } else {
      router.push(`/dashboard/business/${business.id}`)
    }
  }

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold">Add New Business</h1>
          <p className="text-gray-600 mt-1">Create a new business profile</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Business Logo</Label>
              <div className="space-y-3">
                {logoUrl ? (
                  <div className="relative inline-block">
                    <Image
                      src={logoUrl}
                      alt="Business Logo"
                      width={200}
                      height={200}
                      className="rounded-lg border-2 border-gray-200 object-contain bg-white"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={() => setLogoUrl('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">No logo uploaded</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500">Max 2MB, PNG/JPG/GIF</p>
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Lady Naya Villas"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug (Auto-Generated) *</Label>
              <Input
                id="slug"
                value={slug}
                readOnly
                className="bg-gray-50"
                placeholder="ladynayavillas"
              />
              {slug && (
                <p className="text-sm text-blue-600">
                  Your business URL: /{slug}
                </p>
              )}
            </div>

            {message && (
              <div className={`p-3 rounded-md ${message.includes('Error') ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </p>
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={saving || !name}>
              {saving ? 'Creating...' : 'Create Business'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
