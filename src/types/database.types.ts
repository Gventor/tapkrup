export interface Business {
  id: string
  user_id: string
  name: string
  slug: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  business_id: string
  title: string
  sub_slug: string | null
  is_main: boolean
  password_hash: string | null
  created_at: string
  updated_at: string
}

export interface PageBlock {
  id: string
  page_id: string
  block_type: BlockType
  display_order: number
  data: BlockData
  created_at: string
  updated_at: string
}

export type BlockType =
  | 'basic_info'
  | 'contact'
  | 'social_media'
  | 'messaging'
  | 'location'
  | 'business_hours'
  | 'photo_gallery'
  | 'video'
  | 'heading_text'
  | 'heading_link'
  | 'price_list'
  | 'menu'
  | 'service_list'
  | 'vehicle_fleet'
  | 'room_types'
  | 'tour_packages'
  | 'itinerary'
  | 'reviews'
  | 'amenities'
  | 'faq'
  | 'booking_form'
  | 'special_offers'
  | 'cancellation_policy'
  | 'requirements'
  | 'payment_methods'

export type BlockData = {
  // Basic Info
  description?: string
  image_url?: string

  // Contact
  phone?: string
  email?: string
  website?: string

  // Social Media
  facebook?: string
  instagram?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  linkedin?: string

  // Messaging
  line?: string
  whatsapp?: string
  telegram?: string
  wechat?: string

  // Location
  address?: string
  google_maps?: string
  directions?: string

  // Business Hours
  hours?: string

  // Heading + Text/Link
  heading?: string
  text?: string
  link?: string
  button_text?: string

  // Photo Gallery
  images?: Array<{ url: string; caption?: string }>

  // Video
  video_url?: string
  video_platform?: 'youtube' | 'vimeo'

  // Price List / Menu / Services
  items?: Array<{
    name: string
    price?: string
    description?: string
    image_url?: string
    duration?: string
    features?: string[]
  }>

  // Vehicle Fleet
  vehicles?: Array<{
    name: string
    type: string
    price_per_day?: string
    price_per_hour?: string
    features?: string[]
    image_url?: string
  }>

  // Room Types
  rooms?: Array<{
    name: string
    price: string
    capacity?: string
    features?: string[]
    images?: string[]
  }>

  // Tour Packages
  tours?: Array<{
    name: string
    duration: string
    price: string
    description?: string
    included?: string[]
    excluded?: string[]
    image_url?: string
  }>

  // Itinerary
  days?: Array<{
    day_number: number
    title: string
    activities: Array<{
      time: string
      activity: string
      description?: string
    }>
  }>

  // Reviews
  reviews?: Array<{
    name: string
    rating: number
    text: string
    date?: string
  }>

  // Amenities
  amenities?: string[]

  // FAQ
  faqs?: Array<{
    question: string
    answer: string
  }>

  // Special Offers
  offer_title?: string
  offer_description?: string
  discount?: string
  valid_until?: string

  // Requirements
  requirements?: string[]

  // Payment Methods
  payment_methods?: string[]

  // Generic
  [key: string]: any
}

export interface NfcLink {
  id: string
  code: string
  page_id: string
  created_at: string
}
