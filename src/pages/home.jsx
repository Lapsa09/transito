import { useSelector } from 'react-redux'

import styles from '../styles/Home.module.css'

export default function Home() {
  const user = useSelector((x) => x.user.user)

  return (
    <div className={styles.home}>
      <h1>
        BIENVENIDO {user?.nombre} {user?.apellido} LP {user?.legajo}
      </h1>
      <iframe
        title="Tablero de Control OVT"
        width="100%"
        height="750"
        src="https://app.powerbi.com/reportEmbed?reportId=9932ac42-95de-48a7-a501-9118a0905a7f&autoAuth=true&ctid=4d5bce01-0858-4559-ab59-4a838e82866b"
        frameBorder="1"
        allowFullScreen="true"
      ></iframe>
    </div>
  )
}
