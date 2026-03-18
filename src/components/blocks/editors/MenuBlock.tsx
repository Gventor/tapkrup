'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import BlockWrapper from '../BlockWrapper'
import { Plus, X } from 'lucide-react'

interface MenuBlockProps {
  data: {
    category?: string
    items?: Array<{
      name: string
      price: string
      description?: string
    }>
  }
  onChange: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function MenuBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: MenuBlockProps) {
  const items = data.items || []

  const addItem = () => {
    onChange({
      ...data,
      items: [...items, { name: '', price: '', description: '' }],
    })
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    onChange({ ...data, items: newItems })
  }

  const removeItem = (index: number) => {
    onChange({
      ...data,
      items: items.filter((_, i) => i !== index),
    })
  }

  return (
    <BlockWrapper
      title="Menu"
      icon="🍽️"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Menu Category</Label>
          <Input
            id="category"
            value={data.category || ''}
            onChange={(e) => onChange({ ...data, category: e.target.value })}
            placeholder="Breakfast, Lunch, Dinner, Drinks, etc."
          />
        </div>

        <div className="space-y-3">
          <Label>Menu Items</Label>
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">Item {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  placeholder="Dish name"
                />
                <Input
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', e.target.value)}
                  placeholder="Price (e.g., 150฿)"
                />
              </div>
              
              <Input
                value={item.description || ''}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                placeholder="Description (optional)"
              />
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      </div>
    </BlockWrapper>
  )
}
