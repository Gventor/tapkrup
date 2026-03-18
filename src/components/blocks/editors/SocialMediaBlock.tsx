'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BlockWrapper from '../BlockWrapper'

interface SocialMediaBlockProps {
  data: {
    facebook?: string
    instagram?: string
    twitter?: string
    tiktok?: string
    youtube?: string
    linkedin?: string
  }
  onChange: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function SocialMediaBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: SocialMediaBlockProps) {
  return (
    <BlockWrapper
      title="Social Media"
      icon="📱"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            value={data.facebook || ''}
            onChange={(e) => onChange({ ...data, facebook: e.target.value })}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={data.instagram || ''}
            onChange={(e) => onChange({ ...data, instagram: e.target.value })}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter / X</Label>
          <Input
            id="twitter"
            value={data.twitter || ''}
            onChange={(e) => onChange({ ...data, twitter: e.target.value })}
            placeholder="https://twitter.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tiktok">TikTok</Label>
          <Input
            id="tiktok"
            value={data.tiktok || ''}
            onChange={(e) => onChange({ ...data, tiktok: e.target.value })}
            placeholder="https://tiktok.com/@..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube">YouTube</Label>
          <Input
            id="youtube"
            value={data.youtube || ''}
            onChange={(e) => onChange({ ...data, youtube: e.target.value })}
            placeholder="https://youtube.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={data.linkedin || ''}
            onChange={(e) => onChange({ ...data, linkedin: e.target.value })}
            placeholder="https://linkedin.com/..."
          />
        </div>
      </div>
    </BlockWrapper>
  )
}
