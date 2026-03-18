import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface BusinessHoursBlockDisplayProps {
  data: {
    hours?: string
  }
}

export default function BusinessHoursBlockDisplay({ data }: BusinessHoursBlockDisplayProps) {
  if (!data.hours) return null

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Opening Hours
      </h3>
      <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">
        {data.hours}
      </pre>
    </Card>
  )
}
