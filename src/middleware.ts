import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname.startsWith('/auth')
  const isDashboard = pathname.startsWith('/dashboard')
  const isAdminDash = pathname.startsWith('/dashboard/admin')
  const isUserDash = pathname.startsWith('/dashboard/user')

  // Helper: redirect dengan cookie
  function redirectTo(path: string) {
    const url = request.nextUrl.clone()
    url.pathname = path
    const res = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) => {
      res.cookies.set(c.name, c.value)
    })
    return res
  }

  // Belum login → akses dashboard → redirect ke login
  if (!user && isDashboard) {
    return redirectTo('/auth/login')
  }

  // Sudah login → akses auth page → redirect ke dashboard
  if (user && isAuthPage) {
    const role = (user.user_metadata?.role || 'user').toLowerCase()
    return redirectTo(`/dashboard/${role}`)
  }

  // Check Role based Dashboard access
  if (user && isDashboard) {
    const role = (user.user_metadata?.role || 'user').toLowerCase()
    
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return redirectTo(`/dashboard/${role}`)
    }
    
    if (pathname.startsWith('/dashboard/dokter') && role !== 'dokter') {
      return redirectTo(`/dashboard/${role}`)
    }
    
    if (pathname.startsWith('/dashboard/apoteker') && role !== 'apoteker') {
      return redirectTo(`/dashboard/${role}`)
    }
    
    if (pathname.startsWith('/dashboard/user') && role !== 'user') {
      return redirectTo(`/dashboard/${role}`)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
