import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blockId, password } = body

    if (!blockId || !password) {
      return NextResponse.json(
        { error: 'Block ID and password required' },
        { status: 400 }
      )
    }

    const { data: block, error } = await supabase
      .from('page_blocks')
      .select('id, data')
      .eq('id', blockId)
      .single()

    if (error || !block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 })
    }

    const manageHash = (block.data as { manage_password_hash?: string })?.manage_password_hash
    if (!manageHash) {
      return NextResponse.json({ error: 'Management is not password protected' }, { status: 400 })
    }

    const valid = await bcrypt.compare(password, manageHash)
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    const cookieName = `bikes_manage_${blockId.replace(/-/g, '_')}`
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
