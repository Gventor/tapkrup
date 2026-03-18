'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronUp, ChevronDown, Trash2, GripVertical } from 'lucide-react'

interface BlockWrapperProps {
  title: string
  icon?: string
  children: React.ReactNode
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export default function BlockWrapper({
  title,
  icon,
  children,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp = true,
  canMoveDown = true,
  isExpanded = true,
  onToggleExpand,
}: BlockWrapperProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400" />
          {icon && <span className="text-xl">{icon}</span>}
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={!canMoveUp}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={!canMoveDown}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </Card>
  )
}
