import { getServerSession } from 'next-auth/next'
import { roles } from '@prisma/client'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const data = await getServerSession(authOptions)

  const user = data?.user

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
