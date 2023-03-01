import { getMotivosPaseo, getZonasPaseo } from '@services/controlDiarioService'
import {
  getAllZonas,
  getLicencias,
  getMotivos,
  getResolucion,
  getSeguridad,
  getTurnos,
  getZonasVL,
} from '@services/index'
import { useEffect, useState } from 'react'

interface SelectData {
  resolucion: string[]
  turnos: string[]
  barrios: { id_barrio: number; barrio: string }[]
  vicente_lopez: { id_barrio: number; barrio: string }[]
  motivos: { id_motivo: number; motivo: string }[]
  licencias: { id_tipo: number; tipo: string }[]
  seguridad: string[]
  motivos_paseo: string[]
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
