'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import BlockWrapper from '../BlockWrapper'
import { Plus, X, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import Image from 'next/image'

interface PhotoGalleryBlockProps {
  data: {
    heading?: string
    images?: Array<{
      url: string
      caption?: string
    }>
  }
  onChange: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function PhotoGalleryBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: PhotoGalleryBlockProps) {
  const [uploading, setUploading] = useState(false)
  const images = data.images || []

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB')
      return
    }

    setUploading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `logos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file)

    if (uploadError) {
      alert('Error: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath)

    onChange({
      ...data,
      images: [...images, { url: publicUrl, caption: '' }],
    })

    setUploading(false)
    e.target.value = ''
  }

  const updateCaption = (index: number, caption: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], caption }
    onChange({ ...data, images: newImages })
  }

  const removeImage = (index: number) => {
    onChange({
      ...data,
      images: images.filter((_, i) => i !== index),
    })
  }

  return (
    <BlockWrapper
      title="Photo Gallery"
      icon="🖼️"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="heading">Gallery Heading (Optional)</Label>
          <Input
            id="heading"
            value={data.heading || ''}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Our Gallery, Photos, etc."
          />
        </div>

        <div className="space-y-3">
          <Label>Images</Label>
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={image.url}
                      alt={image.caption || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    value={image.caption || ''}
                    onChange={(e) => updateCaption(index, e.target.value)}
                    placeholder="Caption (optional)"
                    className="text-xs"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <Label htmlFor="gallery-upload" className="cursor-pointer">
              <span className="text-sm text-blue-600 hover:underline">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </span>
            </Label>
            <Input
              id="gallery-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-1">Max 2MB per image</p>
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}
