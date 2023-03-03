import {
  getMotivosPaseo,
  getZonasPaseo,
} from '../services/controlDiarioService'
import {
  getAllZonas,
  getLicencias,
  getMotivos,
  getResolucion,
  getSeguridad,
  getTurnos,
  getZonasVL,
} from '../services'
import { useEffect, useState } from 'react'
import {
  IMotivosPaseo,
  IResolucion,
  ISeguridad,
  ITurnos,
  ILicencias,
  IMotivos,
  IZona,
  IBarrio,
} from '../types'

interface SelectData {
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

export default function useSelects() {
  const [data, setData] = useState<SelectData>()
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSelects = async () => {
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
        setData({
          resolucion,
          turnos,
          barrios,
          vicente_lopez,
          motivos,
          licencias,
          seguridad,
          motivos_paseo,
          zonas_paseo,
        })
      } catch (err) {
        setError(err.response?.data)
      }
    }
    fetchSelects()
  }, [])
  return { data, error }
}
