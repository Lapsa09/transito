import { getToken } from 'next-auth/jwt'

import { NextRequest, NextResponse } from 'next/server'
import { User } from './types'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const publicPages = ['/login', '/register']
  const isProtectedPath = !publicPages.some((page) => pathname.startsWith(page))

  const token = await getToken({ req }).then((t) => t as User | undefined)

  if (!token && isProtectedPath) {
    const url = new URL('/login', req.nextUrl)
    return NextResponse.redirect(url)
  }

  if (token) {
    if ('legajo' in token) {
      const rolePage = token.metaData.rol_url
      const iAmAllowed = pathname.startsWith(rolePage)
      if (!isProtectedPath || !iAmAllowed) {
        const url = new URL(rolePage, req.url)
        return NextResponse.redirect(url)
      }
    } else {
      if (!pathname.startsWith('/invitados')) {
        const url = new URL('/login/invitado', req.nextUrl)
        return NextResponse.redirect(url)
      }
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|setran|api).*)'],
}
