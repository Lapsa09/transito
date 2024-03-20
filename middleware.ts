import { getToken } from 'next-auth/jwt'

import { NextRequest, NextResponse } from 'next/server'
import { InvitedUser, User } from './types'
import { fetcher } from './services'
import { permisos } from '@prisma/client'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const response = await fetcher('/api/roles')
  const roles: permisos[] = await response.json()
  const rolePages = Object.fromEntries(
    roles.map((r) => [r.permiso, r.url]),
  ) as Record<string, string>
  const publicPages = ['/login', '/register']
  const isProtectedPath = !publicPages.some((page) => pathname.startsWith(page))

  const token = await getToken({ req }).then((t) => t as User | InvitedUser)

  if (!token && isProtectedPath) {
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', encodeURI(req.url))
    return NextResponse.redirect(url)
  }

  if (token) {
    if ('role' in token) {
      const { role } = token
      const rolePage = rolePages[role]
      const iAmAllowed = pathname.startsWith(rolePage)
      if (
        !isProtectedPath ||
        !iAmAllowed ||
        pathname.startsWith('/invitados')
      ) {
        const url = new URL(rolePage, req.url)
        return NextResponse.redirect(url)
      }
    } else {
      if (pathname.startsWith('/invitados')) return NextResponse.next()
      const url = new URL('/invitados/examen', req.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|setran|api).*)'],
}
