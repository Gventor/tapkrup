import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MessagingBlockDisplayProps {
  data: {
    line?: string
    whatsapp?: string
    telegram?: string
    wechat?: string
  }
}

export default function MessagingBlockDisplay({ data }: MessagingBlockDisplayProps) {
  return (
    <div className="space-y-3">
      {data.line && (
        <Link href={data.line} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full h-16 text-lg font-semibold bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl" size="lg">
            <MessageCircle className="mr-3 h-6 w-6" />
            LINE
          </Button>
        </Link>
      )}

      {data.whatsapp && (
        <Link href={data.whatsapp} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full h-16 text-lg font-semibold bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl" size="lg">
            <MessageCircle className="mr-3 h-6 w-6" />
            WhatsApp
          </Button>
        </Link>
      )}

      {data.telegram && (
        <Link href={data.telegram} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full h-16 text-lg font-semibold bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl" size="lg">
            <Send className="mr-3 h-6 w-6" />
            Telegram
          </Button>
        </Link>
      )}

      {data.wechat && (
        <div className="bg-[var(--tapkrup-green)] text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="h-6 w-6" />
            <span className="font-semibold text-lg">WeChat</span>
          </div>
          <p className="text-sm">ID: {data.wechat}</p>
        </div>
      )}
    </div>
  )
}
