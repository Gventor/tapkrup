'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
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
    setLoading(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    if (newPassword !== confirmPassword) {
      setMessage('Error: Passwords do not match')
      setSaving(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage('Error: Password must be at least 6 characters')
      setSaving(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSaving(false)
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
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings</p>
        </div>

        {/* Account Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                value={userEmail}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                Your email address cannot be changed
              </p>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md ${message.includes('Error') ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200">
          <h2 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Once you logout, you&apos;ll need to login again to access your dashboard.
            </p>
            <Button variant="destructive" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
