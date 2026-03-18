'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BlockWrapper from '../BlockWrapper'

interface MessagingBlockProps {
  data: {
    line?: string
    whatsapp?: string
    telegram?: string
    wechat?: string
  }
  onChange: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function MessagingBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: MessagingBlockProps) {
  return (
    <BlockWrapper
      title="Messaging Apps"
      icon="💬"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="line">LINE</Label>
          <Input
            id="line"
            value={data.line || ''}
            onChange={(e) => onChange({ ...data, line: e.target.value })}
            placeholder="https://line.me/ti/p/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={data.whatsapp || ''}
            onChange={(e) => onChange({ ...data, whatsapp: e.target.value })}
            placeholder="https://wa.me/66812345678"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegram">Telegram</Label>
          <Input
            id="telegram"
            value={data.telegram || ''}
            onChange={(e) => onChange({ ...data, telegram: e.target.value })}
            placeholder="https://t.me/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wechat">WeChat ID</Label>
          <Input
            id="wechat"
            value={data.wechat || ''}
            onChange={(e) => onChange({ ...data, wechat: e.target.value })}
            placeholder="wechat_username"
          />
        </div>
      </div>
    </BlockWrapper>
  )
}
