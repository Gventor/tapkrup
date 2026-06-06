import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Public site origin for share/QR links. Uses NEXT_PUBLIC_SITE_URL when set. */
export function getPublicOrigin(fallback?: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (siteUrl) return siteUrl.replace(/\/$/, '')
  if (fallback) return fallback.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function getPublicUrl(path: string, fallbackOrigin?: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const origin = getPublicOrigin(fallbackOrigin)
  return origin ? `${origin}${normalizedPath}` : normalizedPath
}

/** App-wide date format: dd/mm/yyyy */
export function formatDate(dateString: string): string {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`
  }
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/** Format number as Thai Baht: 75,000 THB */
export function formatThb(amount: number): string {
  return `${Number(amount).toLocaleString('en-US')} THB`
}

/** Format number with commas for input display (75,000) */
export function formatThbInput(value: number | null | undefined): string {
  if (value == null || (typeof value === 'number' && value === 0)) return ''
  return Number(value).toLocaleString('en-US')
}

/** Parse comma-formatted string to number for DB */
export function parseThbInput(value: string): number | null {
  const n = parseFloat(String(value || '').replace(/,/g, '').trim())
  return isNaN(n) ? null : n
}

/** Handle THB input - strips non-digits, formats with commas */
export function handleThbInputChange(value: string, setter: (s: string) => void): void {
  const digits = String(value || '').replace(/\D/g, '')
  setter(digits === '' ? '' : Number(digits).toLocaleString('en-US'))
}
