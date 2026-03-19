import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface SocialMediaBlockDisplayProps {
  data: {
    facebook?: string
    instagram?: string
    twitter?: string
    tiktok?: string
    youtube?: string
    linkedin?: string
  }
}

export default function SocialMediaBlockDisplay({ data }: SocialMediaBlockDisplayProps) {
  const hasAnySocial = data.facebook || data.instagram || data.twitter || data.tiktok || data.youtube || data.linkedin

  if (!hasAnySocial) return null

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Follow Us</h3>
      <div className="grid grid-cols-3 gap-3">
        {data.facebook && (
          <Link href={data.facebook} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-16 flex-col gap-1 border-[var(--tapkrup-navy)] text-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy)] hover:text-white">
              <Facebook className="h-6 w-6" />
              <span className="text-xs">Facebook</span>
            </Button>
          </Link>
        )}
        
        {data.instagram && (
          <Link href={data.instagram} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-16 flex-col gap-1 border-[var(--tapkrup-navy)] text-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy)] hover:text-white">
              <Instagram className="h-6 w-6" />
              <span className="text-xs">Instagram</span>
            </Button>
          </Link>
        )}
        
        {data.twitter && (
          <Link href={data.twitter} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-16 flex-col gap-1 border-[var(--tapkrup-navy)] text-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy)] hover:text-white">
              <Twitter className="h-6 w-6" />
              <span className="text-xs">Twitter</span>
            </Button>
          </Link>
        )}
        
        {data.tiktok && (
          <Link href={data.tiktok} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-16 flex-col gap-1 border-[var(--tapkrup-navy)] text-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy)] hover:text-white">
              <div className="text-2xl">🎵</div>
              <span className="text-xs">TikTok</span>
            </Button>
          </Link>
        )}
        
        {data.youtube && (
          <Link href={data.youtube} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-16 flex-col gap-1 border-[var(--tapkrup-navy)] text-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy)] hover:text-white">
              <Youtube className="h-6 w-6" />
              <span className="text-xs">YouTube</span>
            </Button>
          </Link>
        )}
        
        {data.linkedin && (
          <Link href={data.linkedin} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-16 flex-col gap-1 border-[var(--tapkrup-navy)] text-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy)] hover:text-white">
              <Linkedin className="h-6 w-6" />
              <span className="text-xs">LinkedIn</span>
            </Button>
          </Link>
        )}
      </div>
    </Card>
  )
}
