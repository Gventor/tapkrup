'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BlockWrapper from '../BlockWrapper'

interface LocationBlockProps {
  data: {
    address?: string
    google_maps?: string
  }
  onChange: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function LocationBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: LocationBlockProps) {
  return (
    <BlockWrapper
      title="Location & Maps"
      icon="📍"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={data.address || ''}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
            placeholder="123 Main St, Bangkok, Thailand"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="google_maps">Google Maps Link</Label>
          <Input
            id="google_maps"
            value={data.google_maps || ''}
            onChange={(e) => onChange({ ...data, google_maps: e.target.value })}
            placeholder="https://maps.google.com/..."
          />
          <p className="text-xs text-gray-500">
            Get link from Google Maps → Share → Copy link
          </p>
        </div>
      </div>
    </BlockWrapper>
  )
}
