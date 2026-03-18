import { Card } from '@/components/ui/card'

interface HeadingTextBlockDisplayProps {
  data: {
    heading?: string
    text?: string
  }
}

export default function HeadingTextBlockDisplay({ data }: HeadingTextBlockDisplayProps) {
  if (!data.heading && !data.text) return null

  return (
    <Card className="p-6">
      {data.heading && (
        <h3 className="font-bold text-xl mb-3">{data.heading}</h3>
      )}
      {data.text && (
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {data.text}
        </p>
      )}
    </Card>
  )
}
