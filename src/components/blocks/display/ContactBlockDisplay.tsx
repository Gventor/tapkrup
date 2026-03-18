import { Phone, Mail, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ContactBlockDisplayProps {
  data: {
    phone?: string
    email?: string
    website?: string
  }
}

export default function ContactBlockDisplay({ data }: ContactBlockDisplayProps) {
  return (
    <div className="space-y-3">
      {data.phone && (
        <Link href={`tel:${data.phone}`} className="block">
          <Button className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl" size="lg">
            <Phone className="mr-3 h-6 w-6" />
            Call Now
          </Button>
        </Link>
      )}

      {data.email && (
        <Link href={`mailto:${data.email}`} className="block">
          <Button className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl" size="lg">
            <Mail className="mr-3 h-6 w-6" />
            Email Us
          </Button>
        </Link>
      )}

      {data.website && (
        <Link href={data.website} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl" size="lg">
            <Globe className="mr-3 h-6 w-6" />
            Visit Website
          </Button>
        </Link>
      )}
    </div>
  )
}
