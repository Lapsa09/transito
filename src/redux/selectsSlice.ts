import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit'
import {
  getAllZonas,
  getLicencias,
  getMotivos,
  getResolucion,
  getSeguridad,
  getTurnos,
  getZonasVL,
} from '../services'
import {
  getMotivosPaseo,
  getZonasPaseo,
} from '../services/controlDiarioService'
import {
  IBarrio,
  ILicencias,
  IMotivos,
  IMotivosPaseo,
  IResolucion,
  ISeguridad,
  ITurnos,
  IZona,
} from '../types'

export interface SelectData {
  resolucion: IResolucion[]
  turnos: ITurnos[]
  barrios: IBarrio[]
  vicente_lopez: IZona[]
  motivos: IMotivos[]
  licencias: ILicencias[]
  seguridad: ISeguridad[]
  motivos_paseo: IMotivosPaseo[]
  zonas_paseo: { id_zona: number; zona: string }[]
}

export interface ISelectRouter {
  selects: SelectData
  error: SerializedError
}

function createInitialState() {
  const selects: SelectData = {
    barrios: null,
    licencias: null,
    motivos: null,
    motivos_paseo: null,
    resolucion: null,
    seguridad: null,
    turnos: null,
    vicente_lopez: null,
    zonas_paseo: null,
  }
  const error: SerializedError = null

  return {
    selects,
    error,
  }
}

function createExtraActions() {
  return { fetchSelects: fetchSelects() }
  function fetchSelects() {
    return createAsyncThunk('selects', async () => {
      try {
        const [
          resolucion,
          turnos,
          barrios,
          vicente_lopez,
          motivos,
          licencias,
          seguridad,
          motivos_paseo,
          zonas_paseo,
        ] = await Promise.all([
          getResolucion(),
          getTurnos(),
          getAllZonas(),
          getZonasVL(),
          getMotivos(),
          getLicencias(),
          getSeguridad(),
          getMotivosPaseo(),
          getZonasPaseo(),
        ])
        return {
          resolucion,
          turnos,
          barrios,
          vicente_lopez,
          motivos,
          licencias,
          seguridad,
          motivos_paseo,
          zonas_paseo,
        }
      } catch (error) {
        throw new Error(error.response.data)
      }
    })
  }
}

function createExtraReducers() {
  return (builder: ActionReducerMapBuilder<ISelectRouter>) => {
    builder
      .addCase(extraActions.fetchSelects.pending, (state) => {
        state.error = null
      })
      .addCase(extraActions.fetchSelects.fulfilled, (state, action) => {
        state.selects = { ...action.payload }
      })
      .addCase(extraActions.fetchSelects.rejected, (state, action) => {
        state.error = { ...action.error }
      })
  }
}

const name = 'selects'
const initialState = createInitialState()
const extraActions = createExtraActions()
const extraReducers = createExtraReducers()
const slice = createSlice({ name, initialState, extraReducers, reducers: null })

export const selectActions = { ...extraActions }
export const selectReducer = slice.reducer
