'use client'
import { useSession } from 'next-auth/react'
import { roles } from '@prisma/client'

export default function Home() {
  const { data } = useSession()

  const { user } = data || {}

  const fullName = user?.nombre + ' ' + user?.apellido

  return (
    <div className="flex flex-col min-h-max">
      <h1>
        Bienvenido {fullName} Legajo {user?.legajo}
      </h1>
      {user?.role === roles.ADMIN && (
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
