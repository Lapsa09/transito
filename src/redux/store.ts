import { configureStore } from '@reduxjs/toolkit'
import { selectReducer, ISelectRouter } from './selectsSlice'
import { authReducer, IRootUser } from './userSlice'

export type IRootState = {
  user: IRootUser
  selects: ISelectRouter
}

export const store = configureStore<IRootState>({
  reducer: { user: authReducer, selects: selectReducer },
})

export type AppDispatch = typeof store.dispatch
