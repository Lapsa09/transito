import { configureStore } from '@reduxjs/toolkit'
import { selectReducer, ISelectRouter } from './selectsSlice'
import { authReducer, IRootUser } from './userSlice'
import { snackbarReducer, SnackbarState } from './snackbarSlice'
import { recordReducer } from './recordSlice'

export type IRootState = {
  user: IRootUser
  selects: ISelectRouter
  snackbar: SnackbarState
  record: { id: number }
}

export const store = configureStore({
  reducer: {
    user: authReducer,
    selects: selectReducer,
    snackbar: snackbarReducer,
    record: recordReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      ...getDefaultMiddleware(),
      serializableCheck: false,
    })
  },
})

export type AppDispatch = typeof store.dispatch
