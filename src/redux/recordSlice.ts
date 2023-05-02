import { createSlice } from '@reduxjs/toolkit'

const recordSlice = createSlice({
  name: 'record',
  initialState: {
    id: 0,
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload
    },
    cleanId: (state) => {
      state.id = 0
    },
  },
})

export const { setId } = recordSlice.actions
export const recordReducer = recordSlice.reducer
