import { getServerSession } from 'next-auth/next'
import { roles } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { dashboards } from '@/lib/dashboards'
import { LogoOVT } from '@/components/Logos'
import { User } from '@/types'

export default async function Home() {
  const data = await getServerSession(authOptions)

  const user = data?.user as User

  const fullName = user?.nombre + ' ' + user?.apellido

  return (
    <div className="flex flex-col">
      <h1>
        Bienvenido {fullName}. Legajo {user?.legajo}
      </h1>
      {user?.role === roles.ADMIN && (
        <Tabs
          orientation="vertical"
          defaultValue="Control Vehicular y Denuncias"
        >
          <TabsList>
            <LogoOVT className="mx-auto" />
            {dashboards.map((dashboard) => (
              <TabsTrigger key={dashboard.name} value={dashboard.name}>
                {dashboard.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {dashboards.map((dashboard) => (
            <TabsContent key={dashboard.name} value={dashboard.name}>
              <iframe
                title={dashboard.name}
                width="100%"
                height="700"
                src={dashboard.url}
                allowFullScreen={true}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
