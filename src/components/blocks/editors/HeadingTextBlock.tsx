'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BlockWrapper from '../BlockWrapper'

interface HeadingTextBlockProps {
  data: {
    heading?: string
    text?: string
  }
  onChange: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function HeadingTextBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: HeadingTextBlockProps) {
  return (
    <BlockWrapper
      title="Heading + Text"
      icon="📝"
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
            placeholder="About Us"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text">Text Content</Label>
          <textarea
            id="text"
            value={data.text || ''}
            onChange={(e) => onChange({ ...data, text: e.target.value })}
            placeholder="Write your content here..."
            className="w-full min-h-[150px] px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </BlockWrapper>
  )
}
