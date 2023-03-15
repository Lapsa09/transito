import { configureStore } from '@reduxjs/toolkit'
import { selectReducer, ISelectRouter } from './selectsSlice'
import { authReducer, IRootUser } from './userSlice'

export type IRootState = {
  user: IRootUser
  selects: ISelectRouter
}

export const store = configureStore({
  reducer: { user: authReducer, selects: selectReducer },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      ...getDefaultMiddleware(),
      serializableCheck: false,
    })
  },
})

export type AppDispatch = typeof store.dispatch
