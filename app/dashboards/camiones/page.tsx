import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import { Bars, CamionesTable, Funnel, Mapbox, Pie } from '@/components/charts'
import { getCamionesData } from '@/services/metrics'

async function page() {
  const data = await getCamionesData()
  const [trim12, trim34] = [data.byTrim.slice(0, 2), data.byTrim.slice(2)]
  return (
    <TabsContent value="/camiones">
      <div className="grid grid-cols-3 justify-between">
        <Bars
          data={data.byResolucion}
          maxValue={30000}
          enableGridY={false}
          enableGridX={false}
          axisLeft={null}
          className="h-full"
        />
        <div className="grid grid-cols-2">
          <div className="grid grid-cols-2 col-span-2">
            <Funnel className="h-32 w-full" data={trim12} />
            <Funnel className="h-32 w-full" data={trim34} />
          </div>
          <div className="h-44">
            <Pie data={data.byRemito} />
          </div>
          <div>
            <Funnel className="h-48 w-full" data={data.byMes} />
          </div>
        </div>
        <Pie data={data.byVecinos} />
        <Bars
          data={data.byMotivos}
          maxValue={20}
          enableGridY={false}
          enableGridX={false}
          axisLeft={null}
          className="h-full"
        />
        <Mapbox data={data.geoJSON} />
        <CamionesTable data={data.byLocalidad} />
      </div>
    </TabsContent>
  )
}

export default page
