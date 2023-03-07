import { configureStore } from '@reduxjs/toolkit'
import { selectReducer, ISelectRouter } from './selectsSlice'
import { authReducer, IRootUser } from './userSlice'

export const store = configureStore({
  reducer: { user: authReducer, selects: selectReducer },
})

export type AppDispatch = typeof store.dispatch

export type IRootState = {
  user: IRootUser
  selects: ISelectRouter
}
