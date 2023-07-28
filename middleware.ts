import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const rolePages = {
    INSPECTOR: '/operativos',
    TRAFICO: '/waze',
    ADMINISTRATIVO: '/sueldos',
    ADMIN: '/',
  }

  const publicPages = ['/login', '/register']

  const isProtectedPath = !publicPages.some((page) =>
    req.nextUrl.pathname.startsWith(page)
  )

  const token = await getToken({ req })

  if (!token && isProtectedPath) {
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', encodeURI(req.url))
    return NextResponse.redirect(url)
  }

  if (token) {
    const { role } = token
    const rolePage = rolePages[role]
    const iAmAllowed = !req.nextUrl.pathname.startsWith(rolePage)
    if (!isProtectedPath || iAmAllowed) {
      const url = new URL(rolePage, req.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
