import { DefaultSession } from 'next-auth'
import { Roles, User as IUser, InvitedUser } from './Misc'

type JUser = IUser | InvitedUser
declare module 'next-auth' {
  interface User extends JUser {}
  interface Session extends DefaultSession {
    user?: JUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends JUser {}
}
