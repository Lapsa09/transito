import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { dashboards } from '@/lib/dashboards'
import { LogoOVT } from '@/components/Logos'
import React from 'react'

function page() {
  return (
    <Tabs orientation="vertical" defaultValue="Control Vehicular y Denuncias">
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
  )
}

export default page
