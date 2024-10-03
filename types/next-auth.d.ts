import { DefaultSession } from 'next-auth'
import { User as IUser } from './Misc'

declare module 'next-auth' {
  interface User extends IUser {}
  interface Session {
    user?: IUser
    expires: DefaultSession['expires']
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
