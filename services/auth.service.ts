import { LoginUserProps, RegisterUserProps, RegularUser, User } from '@/types'
import { setter } from './main.service'

export const signUp = async (body: RegisterUserProps) =>
  await setter<User>({ route: 'register', body })

export const signIn = async (body: LoginUserProps) =>
  await setter<RegularUser | null>({ route: 'login', body })
