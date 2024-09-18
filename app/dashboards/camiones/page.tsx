import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import { Bars, CamionesTable, Funnel, Mapbox, Pie } from '@/components/charts'
import { getCamionesData } from '@/services/metrics'
import Image from 'next/image'
import BannerCamiones from '@/assets/imgs/control de camiones.jpg'

async function page() {
  const data = await getCamionesData()
  const [trim12, trim34] = [data.byTrim.slice(0, 2), data.byTrim.slice(2)]
  return (
    <TabsContent value="/camiones" className="grid grid-cols-3 justify-between">
      <Image
        src={BannerCamiones}
        alt="Control de autos"
        height={80}
        className="col-span-3 mx-auto"
      />
      <Bars
        data={data.byResolucion}
        maxValue={30000}
        enableGridY={false}
        enableGridX={false}
        axisLeft={null}
        className="h-full"
      />
      <div className="grid grid-cols-2">
        <Funnel className="h-32 w-full" data={trim12} />
        <Funnel className="h-32 w-full" data={trim34} />
        <Pie data={data.byRemito} />
        <Funnel className="h-48 w-full" data={data.byMes} />
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
    </TabsContent>
  )
}

export default page
