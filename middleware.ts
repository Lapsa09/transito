import { getToken } from 'next-auth/jwt'

import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const publicPages = ['/login', '/register', '/invitados']
  const rolePages = {
    INSPECTOR: '/operativos',
    TRAFICO: '/waze',
    ADMINISTRATIVO: '/sueldos',
    ADMIN: '/',
    LOGISTICA: '/logistica',
    PROFESOR: '/admision/examen',
  }
  const isProtectedPath = !publicPages.some((page) => pathname.startsWith(page))

  const token = await getToken({ req })

  if (!token && isProtectedPath) {
    if (pathname.startsWith('/api')) return NextResponse.next()
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', encodeURI(req.url))
    return NextResponse.redirect(url)
  }
  if (token) {
    const { role } = token
    const rolePage = rolePages[role]
    const iAmAllowed = pathname.startsWith(rolePage)
    if (!isProtectedPath || !iAmAllowed) {
      const url = new URL(rolePage, req.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|setran).*)'],
}
