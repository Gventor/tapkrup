'use client'

import { Label } from '@/components/ui/label'
import BlockWrapper from '../BlockWrapper'

interface BusinessHoursBlockProps {
  data: {
    hours?: string
  }
  onChange: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function BusinessHoursBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: BusinessHoursBlockProps) {
  return (
    <BlockWrapper
      title="Business Hours"
      icon="🕐"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-2">
        <Label htmlFor="hours">Opening Hours</Label>
        <textarea
          id="hours"
          value={data.hours || ''}
          onChange={(e) => onChange({ ...data, hours: e.target.value })}
          placeholder="Mon-Fri: 9:00 AM - 6:00 PM&#10;Sat-Sun: 10:00 AM - 4:00 PM&#10;Closed on public holidays"
          className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-none"
        />
        <p className="text-xs text-gray-500">
          Enter each day on a new line
        </p>
      </div>
    </BlockWrapper>
  )
}
