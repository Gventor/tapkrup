'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface BlockSelectorProps {
  onSelectBlock: (blockType: string) => void
}

export default function BlockSelector({ onSelectBlock }: BlockSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const blockCategories = [
    {
      name: 'Content',
      blocks: [
        { type: 'heading_text', label: 'Heading + Text', icon: '📝' },
        { type: 'heading_link', label: 'Heading + Link', icon: '🔗' },
        { type: 'photo_gallery', label: 'Photo Gallery', icon: '🖼️' },
      ],
    },
    {
      name: 'Contact & Booking',
      blocks: [
        { type: 'contact', label: 'Contact Information', icon: '📞' },
        { type: 'messaging', label: 'Messaging Apps', icon: '💬' },
        { type: 'social_media', label: 'Social Media', icon: '📱' },
      ],
    },
    {
      name: 'Products & Services',
      blocks: [
        { type: 'price_list', label: 'Price List', icon: '💰' },
        { type: 'menu', label: 'Menu (Food/Drinks)', icon: '🍽️' },
      ],
    },
    {
      name: 'Location & Hours',
      blocks: [
        { type: 'location', label: 'Location & Maps', icon: '📍' },
        { type: 'business_hours', label: 'Business Hours', icon: '🕐' },
      ],
    },
  ]

  return (
    <div className="my-6">
      {!isOpen ? (
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full h-14 gap-2 text-lg"
          variant="outline"
        >
          <Plus className="h-5 w-5" />
          Add Block
        </Button>
      ) : (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Choose a Block</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
          
          <div className="space-y-6">
            {blockCategories.map((category) => (
              <div key={category.name}>
                <h4 className="font-semibold text-sm text-gray-600 mb-3">{category.name}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.blocks.map((block) => (
                    <Button
                      key={block.type}
                      type="button"
                      variant="outline"
                      className="h-auto py-3 justify-start gap-3"
                      onClick={() => {
                        onSelectBlock(block.type)
                        setIsOpen(false)
                      }}
                    >
                      <span className="text-2xl">{block.icon}</span>
                      <span className="text-left">{block.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
