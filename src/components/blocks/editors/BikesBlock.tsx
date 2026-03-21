'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BlockWrapper from '../BlockWrapper'

interface BikesBlockProps {
  data: {
    manage_password_hash?: string
  }
  onChange: (data: { manage_password_hash?: string }) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function BikesBlock({
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: BikesBlockProps) {
  const [useManagePassword, setUseManagePassword] = useState(!!data.manage_password_hash)
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSavePassword = async () => {
    if (!useManagePassword) {
      onChange({})
      return
    }
    if (!password || password.length < 4) return
    setSaving(true)
    const bcrypt = (await import('bcryptjs')).default
    const hash = await bcrypt.hash(password, 10)
    onChange({ manage_password_hash: hash })
    setPassword('')
    setSaving(false)
  }

  return (
    <BlockWrapper
      title="Bike Rental"
      icon="🚴"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bikes_manage_password"
            checked={useManagePassword}
            onChange={(e) => {
              setUseManagePassword(e.target.checked)
              if (!e.target.checked) {
                setPassword('')
                onChange({})
              }
            }}
            className="w-4 h-4"
          />
          <Label htmlFor="bikes_manage_password" className="cursor-pointer">
            Require password to Manage (add/edit bikes & rentals from public page)
          </Label>
        </div>
        {useManagePassword && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="bikes_password">
              {data.manage_password_hash ? 'Change password (enter new to update)' : 'Set password'}
            </Label>
            <div className="flex gap-2">
              <Input
                id="bikes_password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 4 characters"
                minLength={4}
              />
              <button
                type="button"
                onClick={handleSavePassword}
                disabled={password.length < 4 || saving}
                className="px-4 py-2 rounded-md bg-[var(--tapkrup-navy)] text-white text-sm font-medium disabled:opacity-50"
              >
                {saving ? '...' : data.manage_password_hash ? 'Update' : 'Set'}
              </button>
            </div>
          </div>
        )}
        <p className="text-sm text-gray-500">
          Add bikes and rentals from the public page. Click &quot;Manage&quot; and enter the password.
        </p>
      </div>
    </BlockWrapper>
  )
}
