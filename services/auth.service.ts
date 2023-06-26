import { RegisterUserProps, User } from '@/types'
import { setter } from './main.service'

export const signUp = async (body: RegisterUserProps) =>
  await setter<User>({ route: 'register', body })
