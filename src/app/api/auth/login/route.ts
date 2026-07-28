import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const cookieJar: Array<{ name: string; value: string; options: any }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieJar.push({ name, value, options })
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  const role = (data.user?.user_metadata?.role || 'user').toLowerCase()
  const validRoles = ['admin', 'dokter', 'apoteker', 'user']
  const dashRole = validRoles.includes(role) ? role : 'user'

  const response = NextResponse.json({ ok: true, role: dashRole }, { status: 200 })
  cookieJar.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}
