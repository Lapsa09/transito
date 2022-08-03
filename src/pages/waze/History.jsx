import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { Table } from '../../components'
import { getDates, getOneDate } from '../../services/wazeService'
import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { ChevronRight, ExpandMore } from '@mui/icons-material'
import style from '../../styles/Waze.module.css'
import { useNavigate } from 'react-router-dom'
import { dateFormat, mesName } from '../../utils/dates'

function History() {
  const [meses, setMeses] = useState([])
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const fetch = async () => {
    const data = await getDates()
    setMeses(data)
  }

  const fetchDia = async (id) => {
    const reportes = await getOneDate(id)
    setData(reportes)
  }

  const horarios = (data) => {
    const arr = Object.entries(data)
    return arr.slice(2)
  }

  const setCollapseOpen = (id) => {
    if (open === id) setOpen(false)
    else setOpen(id)
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <div className={style.historial}>
      <Drawer variant="permanent" anchor="left" className={style.sidebar}>
        <List>
          {meses.map((mes) => (
            <ListItem key={mes.mes} sx={{ display: 'block' }}>
              <ListItemButton onClick={() => setCollapseOpen(mes.mes)}>
                <ListItemText primary={mesName[mes.mes]} />
                {open === mes.mes ? <ExpandMore /> : <ChevronRight />}
              </ListItemButton>
              <Collapse in={open === mes.mes} sx={{ marginLeft: '20px' }}>
                {mes.fechas.map((dia) => (
                  <ListItemButton key={dia.id} onClick={() => fetchDia(dia.id)}>
                    <ListItemText primary={dateFormat(dia.fecha)} />
                  </ListItemButton>
                ))}
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div className={style.dia}>
        <div className={style.header}>
          <button
            className={style.button}
            onClick={() => navigate('/waze', { replace: true })}
          >
            Atras
          </button>
        </div>
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

export default History
