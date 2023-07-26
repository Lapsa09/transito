import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse, NextFetchEvent, NextRequest } from 'next/server'

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  if (isAuthenticated) {
    if (
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/register')
    ) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  const authMiddleware = await withAuth({
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/api')) {
          return true
        } else if (req.nextUrl.pathname.startsWith('/register')) {
          return !token
        } else {
          return !!token
        }
      },
    },
    pages: {
      signIn: '/login',
    },
  })

  // @ts-expect-error
  return authMiddleware(req, event)
}
