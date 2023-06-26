import { Roles, User } from './Misc'

// nextauth.d.ts
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: User
  }
}

// nextauth.d.ts
declare module 'next-auth/jwt' {
  interface JWT extends User {}
}
