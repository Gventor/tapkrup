import { Card } from '@/components/ui/card'

interface PriceListBlockDisplayProps {
  data: {
    heading?: string
    items?: Array<{
      name: string
      price: string
      description?: string
    }>
  }
}

export default function PriceListBlockDisplay({ data }: PriceListBlockDisplayProps) {
  if (!data.items || data.items.length === 0) return null

  return (
    <Card className="p-6">
      {data.heading && (
        <h3 className="font-bold text-xl mb-4">{data.heading}</h3>
      )}
      
      <div className="space-y-4">
        {data.items.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-lg">{item.name}</h4>
              <span className="font-bold text-lg text-[var(--tapkrup-navy)] whitespace-nowrap ml-4">
                {item.price}
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
