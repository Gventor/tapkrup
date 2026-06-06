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
        <Link href={data.wechat.startsWith('http') ? data.wechat : `https://${data.wechat}`} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full h-16 text-lg font-semibold bg-[var(--tapkrup-green)] hover:bg-[var(--tapkrup-green-dark)] text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl" size="lg">
            <MessageCircle className="mr-3 h-6 w-6" />
            WeChat
          </Button>
        </Link>
      )}
    </div>
  )
}
