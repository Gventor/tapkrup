import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageId, password } = body

    if (!pageId || !password) {
      return NextResponse.json(
        { error: 'Page ID and password required' },
        { status: 400 }
      )
    }

    const { data: page, error } = await supabase
      .from('pages')
      .select('id, password_hash')
      .eq('id', pageId)
      .single()

    if (error || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    if (!page.password_hash) {
      return NextResponse.json({ error: 'Page is not password protected' }, { status: 400 })
    }

    const valid = await bcrypt.compare(password, page.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    const cookieName = `page_auth_${pageId.replace(/-/g, '_')}`
    const response = NextResponse.json({ success: true })

    response.cookies.set(cookieName, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
