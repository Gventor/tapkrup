'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BlockWrapper from '../BlockWrapper'

interface VillasBlockProps {
  data: {
    phone?: string
    whatsapp?: string
    line?: string
    telegram?: string
    wechat?: string
    address?: string
    google_maps?: string
  }
  onChange: (data: Record<string, unknown>) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function VillasBlock({
  data = {},
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: VillasBlockProps) {
  const d = data as { phone?: string; whatsapp?: string; line?: string; telegram?: string; wechat?: string; address?: string; google_maps?: string }
  return (
    <BlockWrapper
      title="Villa Rentals"
      icon="🏠"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <p className="text-sm text-gray-600 mb-4">
        Add and manage villas from <strong>Dashboard → Villa Rentals</strong>. This block will display your villa list on the public page.
      </p>
      <h4 className="font-semibold text-sm mb-2">Contact (shown on public page)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={d.phone || ''}
            onChange={(e) => onChange({ ...d, phone: e.target.value })}
            placeholder="+66812345678"
          />
        </div>
        <div className="space-y-2">
          <Label>WhatsApp</Label>
          <Input
            value={d.whatsapp || ''}
            onChange={(e) => onChange({ ...d, whatsapp: e.target.value })}
            placeholder="66812345678"
          />
        </div>
        <div className="space-y-2">
          <Label>LINE</Label>
          <Input
            value={d.line || ''}
            onChange={(e) => onChange({ ...d, line: e.target.value })}
            placeholder="https://line.me/ti/p/..."
          />
        </div>
        <div className="space-y-2">
          <Label>Telegram</Label>
          <Input
            value={d.telegram || ''}
            onChange={(e) => onChange({ ...d, telegram: e.target.value })}
            placeholder="https://t.me/..."
          />
        </div>
        <div className="space-y-2">
          <Label>WeChat ID</Label>
          <Input
            value={d.wechat || ''}
            onChange={(e) => onChange({ ...d, wechat: e.target.value })}
            placeholder="wechat_username"
          />
        </div>
      </div>
      <h4 className="font-semibold text-sm mb-2">Location</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            value={d.address || ''}
            onChange={(e) => onChange({ ...d, address: e.target.value })}
            placeholder="123 Main St, Bangkok"
          />
        </div>
        <div className="space-y-2">
          <Label>Google Maps Link</Label>
          <Input
            value={d.google_maps || ''}
            onChange={(e) => onChange({ ...d, google_maps: e.target.value })}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>
    </BlockWrapper>
  )
}
