import { DefaultSession } from 'next-auth'
import { Roles, User as IUser, InvitedUser } from './Misc'

declare module 'next-auth' {
  interface User extends IntersectionObserver<IUser, InvitedUser> {}
  interface Session extends DefaultSession {
    user?: IUser | InvitedUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
