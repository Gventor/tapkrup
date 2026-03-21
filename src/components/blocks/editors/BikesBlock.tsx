'use client'

import BlockWrapper from '../BlockWrapper'

interface BikesBlockProps {
  data: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function BikesBlock({
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: BikesBlockProps) {
  return (
    <BlockWrapper
      title="Bike Rental"
      icon="🚴"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <p className="text-sm text-gray-600">
        Add and manage bikes from <strong>Dashboard → Bike Rentals</strong>. This block will display your bike list on the public page.
      </p>
    </BlockWrapper>
  )
}
