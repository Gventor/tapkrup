'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Business } from '@/types/database.types'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

export default function AdminPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadBusinesses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuthAndLoadBusinesses = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('businesses')
      .select('*')
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
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">All Businesses</h2>
            <p className="text-sm text-gray-600">Total: {businesses.length}</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No businesses found
                    </TableCell>
                  </TableRow>
                ) : (
                  businesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell>
                        {business.logo_url ? (
                          <div className="relative w-10 h-10">
                            <Image
                              src={business.logo_url}
                              alt="Logo"
                              fill
                              className="rounded object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                            No logo
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {business.name}
                      </TableCell>
                      <TableCell>{business.slug}</TableCell>
                      <TableCell>{formatDate(business.created_at)}</TableCell>
                      <TableCell>
                        <Link href={`/${business.slug}`} target="_blank">
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </main>
  )
}
