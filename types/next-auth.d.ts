import { DefaultSession } from 'next-auth'
import { Roles, User as IUser, RegularUser, InvitedUser } from './Misc'

declare module 'next-auth' {
  interface User extends IUser {}
  interface Session extends DefaultSession {
    user?: RegularUser
  }
  interface Session extends DefaultSession {
    user?: InvitedUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends RegularUser {}
  interface JWT extends InvitedUser {}
}
