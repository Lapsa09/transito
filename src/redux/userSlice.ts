import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit'
import jwt_decode from 'jwt-decode'
import { loginCall, register, verifyAuth } from '../services'
import { Roles, User } from '../types'

const emptyUser: User = {
  apellido: '',
  legajo: 0,
  iat: 0,
  nombre: '',
  telefono: 0,
  rol: null,
  turno: '',
  isAdmin() {
    return this.rol === Roles.ADMIN
  },
}

const emptyError: SerializedError = {
  code: '',
  message: '',
  name: '',
  stack: '',
}

const name = 'user'
const initialState = createInitialState()
const reducers = createReducers()
const extraActions = createExtraActions()
const extraReducers = createExtraReducers()
const slice = createSlice({ name, initialState, reducers, extraReducers })

export type IRootUser = {
  user: User
  error: SerializedError
}

function createInitialState(): IRootUser {
  let user = emptyUser
  let error = emptyError

  try {
    user = { ...jwt_decode(localStorage.getItem('token')) }
    user.isAdmin = () => user.rol === Roles.ADMIN
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
    state.user = emptyUser
    localStorage.removeItem('token')
  }
}

function createExtraActions() {
  return {
    login: login(),
    register: signUp(),
    verify: verify(),
  }

  function login() {
    return createAsyncThunk('user/login', async (body: any) => {
      try {
        return await loginCall(body)
      } catch (error) {
        throw new Error(error.response?.data)
      }
    })
  }
  function signUp() {
    return createAsyncThunk('user/register', async (body: any) => {
      try {
        return await register(body)
      } catch (error) {
        throw new Error(error.response?.data)
      }
    })
  }

  function verify() {
    return createAsyncThunk('user/verify', async () => {
      try {
        return await verifyAuth()
      } catch (error) {
        throw new Error(error.response?.data || error.message)
      }
    })
  }
}

function createExtraReducers() {
  const baseUserReducer = {
    pending: (state) => {
      state.error = emptyError
    },
    fulfilled: (state, action) => {
      const user = action.payload

      localStorage.setItem('token', user)
      state.user = { ...state.user, ...jwt_decode(user) }
    },
    rejected: (state, action) => {
      localStorage.removeItem('token')
      state.user = emptyUser
      state.error = { ...action.error }
    },
  }

  const verifyingUser = {
    pending: (state) => {
      state.error = emptyError
    },
    fulfilled: (state) => {
      const token = localStorage.getItem('token')
      state.user = { ...state.user, ...jwt_decode(token) }
    },
    rejected: (state, action) => {
      localStorage.removeItem('token')
      state.user = emptyUser
      state.error = { ...action.error }
    },
  }
  return (builder: ActionReducerMapBuilder<IRootUser>) => {
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
