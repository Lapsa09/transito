import { setter } from './index'

export const register = async (body) => {
  const res = await setter('/auth/register', body)
  return res
}

export const loginCall = async (body) => {
  return await setter('/auth/login', body)
}

export const verifyAuth = async () => {
  const data = await setter('/auth/verify', null, {
    headers: { jwt_token: localStorage.getItem('token') },
  })
  return data
}
