import { LoginUserProps, RegisterUserProps } from '../types'
import { setter } from '.'

export const register = async (body: RegisterUserProps) =>
  await setter<string>('/auth/register', body)

export const loginCall = async (body: LoginUserProps) =>
  await setter<string>('/auth/login', body)

export const verifyAuth = async () =>
  await setter<boolean>('/auth/verify', null, {
    headers: { jwt_token: localStorage.getItem('token') },
  })
