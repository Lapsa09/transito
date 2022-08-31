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
    verifyAuth()
    user = jwt_decode(localStorage.getItem('token'))
  } catch (err) {
    error = err.response.data || err.message
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
}

function createExtraReducers() {
  return {
    ...login(),
    ...register(),
  }

  function baseUserReducer(actions) {
    const { pending, fulfilled, rejected } = actions
    return {
      [pending]: (state) => {
        state.error = null
      },
      [fulfilled]: (state, action) => {
        const user = action.payload

        localStorage.setItem('token', user)
        state.user = jwt_decode(user)

        const { from } = history.location.state || { from: { pathname: '/' } }
        history.navigate(from)
      },
      [rejected]: (state, action) => {
        console.log(action)
        state.error = action.error
      },
    }
  }

  function login() {
    return baseUserReducer(extraActions.login)
  }

  function register() {
    return baseUserReducer(extraActions.register)
  }
}
