import { DateTime } from 'luxon'
import React, { useEffect, useState } from 'react'
import { Loader, Table } from '../../components'
import { mainWazeGetter } from '../../services'
import style from '../../styles/Waze.module.css'
import { WazePromedio, WazeRes, Horario, Waze } from '../../types'
import { useNavigate } from 'react-router-dom'

function App() {
  const [data, setData] = useState<WazeRes>()
  const [prom, setProm] = useState<WazePromedio>()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const horarios = (data: WazeRes): [string, Horario][] => {
    const arr = Object.entries(data)
    return arr.slice(2)
  }

  const fetch = async () => {
    mainWazeGetter()
      .then(({ res, promedio }) => {
        setData(res)
        setProm(promedio)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetch()
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div className={style.home}>
      <div className={style.header}>
        <button className={style.button} onClick={fetch}>
          Refrescar
        </button>
        <button
          className={style.button}
          onClick={() => navigate('/waze/historial')}
        >
          Historial
        </button>
      </div>
      <div className={style.promedio}>
        <h3>Promedio</h3>
        {Object.entries(prom).map(([hora, calles]) => (
          <div className={style.reporte} key={hora}>
            <h4>
              {DateTime.fromFormat(hora, 'hh:mm:ss').toLocaleString(
                DateTime.TIME_24_SIMPLE
              )}
              :
            </h4>
            <Table key={hora} data={calles} />
          </div>
        ))}
      </div>
      <div className={style.actual}>
        <h3>Fecha: {DateTime.fromISO(data.fecha).toFormat('dd/MM/yyyy')}</h3>
        {horarios(data).map(([h, values]) => (
          <div className={style.reporte} key={h}>
            <h4>
              {DateTime.fromFormat(h, 'hh:mm:ss').toLocaleString(
                DateTime.TIME_24_SIMPLE
              )}
              :
            </h4>
            <Table key={h} data={values} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
