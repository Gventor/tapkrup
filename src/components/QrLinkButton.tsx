'use client'

import { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { QrCode, Download, X } from 'lucide-react'
import { getPublicUrl } from '@/lib/utils'

interface QrLinkButtonProps {
  path: string
  title?: string
  disabled?: boolean
  size?: 'sm' | 'default' | 'lg' | 'icon'
}

export default function QrLinkButton({
  path,
  title = 'QR Code',
  disabled,
  size = 'sm',
}: QrLinkButtonProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (path) setUrl(getPublicUrl(path, window.location.origin))
  }, [path])

  const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1')

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qr-code.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <>
      <Button
        size={size}
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={disabled || !path || !url}
        title="Show QR code"
      >
        <QrCode className="h-4 w-4" />
      </Button>

      {open && url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-center p-4 bg-white rounded-lg border">
              <QRCodeCanvas ref={canvasRef} value={url} size={200} level="M" />
            </div>

            <p className="text-xs text-gray-500 text-center mt-3 break-all">{url}</p>

            {isLocalhost && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                This QR uses localhost, so phones cannot open it. Add your live site URL to{' '}
                <code className="text-[11px]">NEXT_PUBLIC_SITE_URL</code> in{' '}
                <code className="text-[11px]">.env.local</code>, then restart the app.
              </p>
            )}

            <Button className="w-full mt-4 gap-2" onClick={download}>
              <Download className="h-4 w-4" />
              Download QR
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
