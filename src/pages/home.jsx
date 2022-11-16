import { Card, CardContent, Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { CustomizedMenus, CustomMenuItem } from '../components'

import styles from '../styles/Home.module.css'
import { history } from '../utils'

const cardStyle = {
  backgroundColor: '#b7e912',
  color: 'white',
  cursor: 'pointer',
}

export default function Home() {
  const user = useSelector((x) => x.user.user)

  const navigate = (route) => {
    history.navigate(route)
  }

  return (
    <div className={styles.home}>
      <h1>
        BIENVENIDO {user?.nombre} {user?.apellido} LP {user?.legajo}
      </h1>
      {user.rol === 'ADMIN' ? (
        <iframe
          title="Tablero de Control OVT"
          width="100%"
          height="750"
          src="https://app.powerbi.com/reportEmbed?reportId=9932ac42-95de-48a7-a501-9118a0905a7f&autoAuth=true&ctid=4d5bce01-0858-4559-ab59-4a838e82866b"
          frameBorder="1"
          allowFullScreen="true"
        ></iframe>
      ) : (
        <Grid container>
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
