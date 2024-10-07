import { TabsContent } from '@/components/ui/tabs'
import { getter } from '@/services'
import React from 'react'
import PageClient from './page.client'
import { SustanciasMetrics } from '@/DTO/operativos/metrics'

export const dynamic = 'force-dynamic'

const getData = async () => {
  const data = await getter<SustanciasMetrics>({
    route: '/operativos/metrics/sustancias',
  })

  return data
}

async function page() {
  const data = await getData()

  return (
    <TabsContent value="/sustancias">
      <PageClient data={data} />
    </TabsContent>
  )
}

export default page
