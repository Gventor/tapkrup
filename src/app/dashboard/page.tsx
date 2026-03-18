'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Business } from '@/types/database.types'
import Link from 'next/link'
import { Plus, Building2, Settings } from 'lucide-react'
import Image from 'next/image'

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    setUserEmail(user.email || '')

    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setBusinesses(data)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">{userEmail}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/settings">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Add Business Button */}
        <Link href="/dashboard/business/new">
          <Button className="w-full sm:w-auto h-12 gap-2" size="lg">
            <Plus className="h-5 w-5" />
            Add New Business
          </Button>
        </Link>

        {/* Businesses Grid */}
        {businesses.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses yet</h3>
            <p className="text-gray-600 mb-6">Create your first business to get started</p>
            <Link href="/dashboard/business/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Business
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Link key={business.id} href={`/dashboard/business/${business.id}`}>
                <Card className="p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-2 hover:border-blue-500">
                  {business.logo_url && (
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <Image
                        src={business.logo_url}
                        alt={business.name}
                        width={80}
                        height={80}
                        className="object-contain rounded-lg w-full h-full"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-center mb-2">{business.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-4">/{business.slug}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      Manage Pages
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
