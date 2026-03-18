'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BlockWrapper from '../BlockWrapper'

interface HeadingLinkBlockProps {
  data: {
    heading?: string
    link?: string
    button_text?: string
  }
  onChange: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function HeadingLinkBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: HeadingLinkBlockProps) {
  return (
    <BlockWrapper
      title="Heading + Link"
      icon="🔗"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="heading">Heading</Label>
          <Input
            id="heading"
            value={data.heading || ''}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Our Menu"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="button_text">Button Text</Label>
          <Input
            id="button_text"
            value={data.button_text || ''}
            onChange={(e) => onChange({ ...data, button_text: e.target.value })}
            placeholder="View Menu"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Link URL</Label>
          <Input
            id="link"
            value={data.link || ''}
            onChange={(e) => onChange({ ...data, link: e.target.value })}
            placeholder="https://example.com/menu.pdf"
          />
        </div>
      </div>
    </BlockWrapper>
  )
}
