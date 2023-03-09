import { Card, CardContent, Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { CustomizedMenus, CustomMenuItem } from '../components'
import styles from '../styles/Home.module.css'
import { history } from '../utils'
import React from 'react'
import { IRootState } from '../redux'
import { Roles, User } from '../types'

const cardStyle = {
  backgroundColor: '#b7e912',
  color: 'white',
  cursor: 'pointer',
}

export default function Home() {
  const user = useSelector<IRootState, User>((x) => x.user.user)

  const { navigate } = history

  return (
    <div className={styles.home}>
      <h1>
        BIENVENIDO {user.nombre} {user.apellido} LP {user.legajo}
      </h1>
      {user.rol === Roles.ADMIN ? (
        <iframe
          title="Tablero de Control OVT"
          width="100%"
          height="750"
          src="https://app.powerbi.com/reportEmbed?reportId=d984fd02-53ef-46b0-a1f1-98c4d9c6f510&autoAuth=true&ctid=4d5bce01-0858-4559-ab59-4a838e82866b"
          frameBorder="1"
          allowFullScreen={true}
        ></iframe>
      ) : (
        <Grid container sx={{ display: { xs: 'flex', lg: 'none' } }}>
          <CustomizedMenus id={1} label="Operativos">
            <CustomMenuItem onClick={() => navigate('/operativos/autos')}>
              Autos
            </CustomMenuItem>
            <CustomMenuItem onClick={() => navigate('/operativos/motos')}>
              Motos
            </CustomMenuItem>
            <CustomMenuItem onClick={() => navigate('/operativos/camiones')}>
              Camiones
            </CustomMenuItem>
          </CustomizedMenus>
          <CustomizedMenus label="Control" id={2}>
            <CustomMenuItem onClick={() => navigate('/control/diario')}>
              Diario
            </CustomMenuItem>
            <CustomMenuItem onClick={() => navigate('/control/paseo')}>
              Paseo del Rio
            </CustomMenuItem>
          </CustomizedMenus>

          <Card sx={cardStyle} onClick={() => navigate('/sueldos')}>
            <CardContent>
              <Typography variant="h2">Sueldos</Typography>
            </CardContent>
          </Card>
          <Card sx={cardStyle} onClick={() => navigate('/waze')}>
            <CardContent>
              <Typography variant="h2">Waze</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </div>
  )
}
