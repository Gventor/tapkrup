import { MapPin, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface LocationBlockDisplayProps {
  data: {
    address?: string
    google_maps?: string
  }
}

export default function LocationBlockDisplay({ data }: LocationBlockDisplayProps) {
  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Location
      </h3>
      
      {data.address && (
        <p className="text-gray-700 mb-4">{data.address}</p>
      )}

      {data.google_maps && (
        <Link href={data.google_maps} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full h-14 gap-2 bg-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy-dark)] text-white" size="lg">
            <Navigation className="h-5 w-5" />
            Get Directions
          </Button>
        </Link>
      )}
    </Card>
  )
}
