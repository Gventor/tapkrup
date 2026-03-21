'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Lock } from 'lucide-react'

interface PasswordGateProps {
  pageId: string
  pageTitle: string
  businessName: string
  onSuccess: () => void
}

export default function PasswordGate({ pageId, pageTitle, businessName, onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/page-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, password }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Incorrect password')
      return
    }

    onSuccess?.()
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-sm p-6">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[var(--tapkrup-navy)]/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-[var(--tapkrup-navy)]" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-center text-gray-900 mb-1">{pageTitle}</h1>
        <p className="text-sm text-gray-500 text-center mb-6">{businessName}</p>
        <p className="text-sm text-gray-600 text-center mb-4">Enter password to view this page</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12"
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full h-12 bg-[var(--tapkrup-navy)] hover:bg-[var(--tapkrup-navy-dark)]"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Enter'}
          </Button>
        </form>
      </Card>
    </main>
  )
}
