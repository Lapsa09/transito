import { useSelector } from 'react-redux'
import { Header } from '../components/ui/'

import styles from '../styles/Home.module.css'

export default function Home() {
  const user = useSelector((x) => x.user.user)

  return (
    <div className={styles.home}>
      <Header />
      <h1>
        BIENVENIDO {user?.nombre} {user?.apellido} LP {user?.legajo}
      </h1>
    </div>
  )
}
