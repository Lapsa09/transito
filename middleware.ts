export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/operativos/:path*', '/sueldos/:path*', '/'],
}
