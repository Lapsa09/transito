import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import {
  AutosTable,
  Bars,
  Funnel,
  Mapbox,
  Pie,
  Treemap,
} from '@/components/charts'
import { getMotosData } from '@/services/metrics'

async function page() {
  const data = await getMotosData()
  const [trim12, trim34] = [data.byTrim.slice(0, 2), data.byTrim.slice(2)]
  return (
    <TabsContent value="/motos">
      <div className="grid grid-cols-3 justify-between">
        <Bars
          data={data.byResolucion}
          maxValue={30000}
          enableGridY={false}
          enableGridX={false}
          axisLeft={null}
          className="h-full"
        />
        <div>
          <div className="flex items-center">
            <Funnel className="h-32 w-full" data={trim12} />
            <Funnel className="h-32 w-full" data={trim34} />
          </div>
          <Funnel className="h-48 w-full" data={data.byMes} />
        </div>
        <Pie data={data.byVecinos} />
        <Treemap data={data.byMotivos} height={400} width={450} />
        <Mapbox data={data.geoJSON} />
        <AutosTable data={data.byLocalidad} />
      </div>
    </TabsContent>
  )
}

export default page
