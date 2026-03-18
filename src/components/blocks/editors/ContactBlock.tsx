'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BlockWrapper from '../BlockWrapper'

interface ContactBlockProps {
  data: {
    phone?: string
    email?: string
    website?: string
  }
  onChange: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function ContactBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: ContactBlockProps) {
  return (
    <BlockWrapper
      title="Contact Information"
      icon="📞"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={data.phone || ''}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="+66812345678"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="contact@example.com"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website">Website URL</Label>
          <Input
            id="website"
            value={data.website || ''}
            onChange={(e) => onChange({ ...data, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      </div>
    </BlockWrapper>
  )
}
