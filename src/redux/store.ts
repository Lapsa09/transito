import { configureStore } from '@reduxjs/toolkit'
import { authReducer, IRootUser } from './userSlice'

export const store = configureStore({
  reducer: { user: authReducer },
})

export type AppDispatch = typeof store.dispatch

export type IRootState = {
  user?: IRootUser
}
