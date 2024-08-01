import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Empleado } from '@/types'
import { Button } from '@/components/ui'
import Link from 'next/link'

export default async function Home() {
  const data = await getServerSession(authOptions)

  const user = data?.user as Empleado

  if (!user) return redirect('/login')

  const fullName = user.nombre + ' ' + user.apellido

  return (
    <div>
      <h1>
        Bienvenido {fullName}. Legajo {user.legajo}
      </h1>
      {user.metaData.isAdmin && (
        <Button asChild className="mt-5">
          <Link href="/dashboards">Ver dashboards</Link>
        </Button>
      )}
    </div>
  )
}
