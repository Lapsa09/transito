import { useSelector } from 'react-redux'
import styles from '../styles/Home.module.css'
import React from 'react'
import { IRootState } from '../redux'
import { User } from '../types'

export default function Home() {
  const user = useSelector<IRootState, User>((x) => x.user.user)

  return (
    <div className={styles.home}>
      <h1>
        BIENVENIDO {user.nombre} {user.apellido} LP {user.legajo}
      </h1>
      {user.isAdmin() && (
        <iframe
          title="Tablero de Control OVT"
          width="100%"
          height="750"
          src="https://app.powerbi.com/reportEmbed?reportId=d984fd02-53ef-46b0-a1f1-98c4d9c6f510&autoAuth=true&ctid=4d5bce01-0858-4559-ab59-4a838e82866b"
          allowFullScreen={true}
        />
      )}
    </div>
  )
}
