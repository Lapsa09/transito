import { User } from 'types/Misc'
import { setter } from './index'

export const register = async (body) =>
  await setter<User>('/auth/register', body)

export const loginCall = async (body) => await setter<User>('/auth/login', body)

export const verifyAuth = async () =>
  await setter('/auth/verify', null, {
    headers: { jwt_token: localStorage.getItem('token') },
  })
