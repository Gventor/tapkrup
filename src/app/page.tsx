import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">TapKrup</h1>
          <p className="text-xl text-gray-600">
            Create your mobile-friendly business page for NFC tags
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Link href="/login" className="w-full">
            <Button className="w-full h-12 text-lg" size="lg">Login</Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button variant="outline" className="w-full h-12 text-lg" size="lg">Sign Up</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
