import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import jwt_decode from 'jwt-decode'
import { loginCall, register, verifyAuth } from '../services/userService'
import { history } from '../utils'

const name = 'user'
const initialState = createInitialState()
const reducers = createReducers()
const extraActions = createExtraActions()
const extraReducers = createExtraReducers()
const slice = createSlice({ name, initialState, reducers, extraReducers })

function createInitialState() {
  let user = ''
  let error = ''

  try {
    user = jwt_decode(localStorage.getItem('token'))
  } catch (err) {
    error = err
  }

  return {
    user,
    error,
  }
}

export const authActions = { ...slice.actions, ...extraActions }
export const authReducer = slice.reducer

function createReducers() {
  return {
    logout,
  }

  function logout(state) {
    state.user = null
    localStorage.removeItem('token')
    history.navigate('/login')
  }
}

function createExtraActions() {
  return {
    login: login(),
    register: signUp(),
    verify: verify(),
  }

  function login() {
    return createAsyncThunk('user/login', async (body) => {
      try {
        return await loginCall(body)
      } catch (error) {
        throw new Error(error.response.data)
      }
    })
  }
  function signUp() {
    return createAsyncThunk('user/register', async (body) => {
      try {
        return await register(body)
      } catch (error) {
        throw new Error(error.response.data)
      }
    })
  }

  function verify() {
    return createAsyncThunk('user/verify', async () => {
      try {
        return await verifyAuth()
      } catch (error) {
        throw new Error(error.response.data)
      }
    })
  }
}

function createExtraReducers() {
  const baseUserReducer = {
    pending: (state) => {
      state.error = null
    },
    fulfilled: (state, action) => {
      const user = action.payload

      localStorage.setItem('token', user)
      state.user = jwt_decode(user)

      const { from } = history.location.state || { from: { pathname: '/' } }
      history.navigate(from)
    },
    rejected: (state, action) => {
      localStorage.removeItem('token')
      state.error = action.error
    },
  }

  const verifyingUser = {
    pending: (state) => {
      state.error = null
    },
    fulfilled: (state) => {
      state.user = jwt_decode(localStorage.getItem('token'))
      const { from } = history.location.state || { from: { pathname: '/' } }
      history.navigate(from)
    },
    rejected: (state, action) => {
      state.error = action.error
    },
  }
  return (builder) => {
    builder
      .addCase(extraActions.login.fulfilled, baseUserReducer.fulfilled)
      .addCase(extraActions.login.pending, baseUserReducer.pending)
      .addCase(extraActions.login.rejected, baseUserReducer.rejected)
      .addCase(extraActions.register.fulfilled, baseUserReducer.fulfilled)
      .addCase(extraActions.register.pending, baseUserReducer.pending)
      .addCase(extraActions.register.rejected, baseUserReducer.rejected)
      .addCase(extraActions.verify.fulfilled, verifyingUser.fulfilled)
      .addCase(extraActions.verify.pending, verifyingUser.pending)
      .addCase(extraActions.verify.rejected, verifyingUser.rejected)
  }
}
