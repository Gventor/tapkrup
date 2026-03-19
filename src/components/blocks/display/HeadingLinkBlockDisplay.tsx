import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface HeadingLinkBlockDisplayProps {
  data: {
    heading?: string
    link?: string
    button_text?: string
  }
}

export default function HeadingLinkBlockDisplay({ data }: HeadingLinkBlockDisplayProps) {
  if (!data.link) return null

  return (
    <Card className="p-6">
      {data.heading && (
        <h3 className="font-bold text-xl mb-4">{data.heading}</h3>
      )}
      <Link href={data.link} target="_blank" rel="noopener noreferrer" className="block">
        <Button className="w-full h-14 gap-2 bg-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy-dark)] text-white" size="lg">
          <ExternalLink className="h-5 w-5" />
          {data.button_text || 'Visit Link'}
        </Button>
      </Link>
    </Card>
  )
}
