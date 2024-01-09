import { DefaultSession } from 'next-auth'
import { Roles, User as IUser } from './Misc'

declare module 'next-auth' {
  interface User extends IUser {}
  interface Session extends DefaultSession {
    user?: IUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
