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

  if (isProtectedPath) {
    const token = await getToken({ req })
    if (!token) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', encodeURI(req.url))
      return NextResponse.redirect(url)
    }
    const { role } = token
    const rolePage = rolePages[role]
    const url = new URL(rolePage, req.url)
    if (!req.nextUrl.pathname.startsWith(rolePage)) {
      return NextResponse.redirect(url)
    }
  } else {
    const token = await getToken({ req })
    if (token) {
      const { role } = token
      const rolePage = rolePages[role]
      const url = new URL(rolePage, req.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
