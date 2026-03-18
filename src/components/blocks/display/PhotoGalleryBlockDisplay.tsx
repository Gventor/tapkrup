import { Card } from '@/components/ui/card'
import Image from 'next/image'

interface PhotoGalleryBlockDisplayProps {
  data: {
    heading?: string
    images?: Array<{
      url: string
      caption?: string
    }>
  }
}

export default function PhotoGalleryBlockDisplay({ data }: PhotoGalleryBlockDisplayProps) {
  if (!data.images || data.images.length === 0) return null

  return (
    <Card className="p-6">
      {data.heading && (
        <h3 className="font-bold text-xl mb-4">{data.heading}</h3>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.images.map((image, index) => (
          <div key={index} className="space-y-2">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
              <Image
                src={image.url}
                alt={image.caption || `Photo ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {image.caption && (
              <p className="text-xs text-gray-600 text-center">{image.caption}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
