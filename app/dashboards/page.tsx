import { TabsContent } from '@/components/ui/tabs'
import { getCitymis, getData } from '@/services/metrics'
import { Bars, Funnel, Speedometer } from '@/components/charts'
import * as UtilsMotos from '@/utils/metrics/motos'
import * as UtilsCamiones from '@/utils/metrics/camiones'
import * as UtilsAutos from '@/utils/metrics/autos'
import Image from 'next/image'
import BannerSubsecretaria from '@/assets/imgs/Banners SubSecretarial.png'

const CURRENT_MONTH = new Date().getMonth()

export default async function Home() {
  const data = await getData()
  const citymis = await getCitymis()

  const ultimoMes = data.byMes.at(-1)

  function timeDiffCalc(diffInMilliSeconds: number) {
    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60
    diffInMilliSeconds -= minutes * 60

    // calculate secounds
    const secd = diffInMilliSeconds % 60
    const seconds = Math.ceil(secd)

    let difference = ''

    difference += minutes === 0 ? `${minutes}' ` : `${minutes}' `

    difference += minutes === 1 ? `${seconds}"` : `${seconds}"`

    return difference
  }

  return (
    <TabsContent value="estadisticas">
      <div className="grid grid-rows-3 grid-cols-3">
        <div className="row-start-1">
          <h1 className="text-center">
            {data.totalVehiculos} Vehiculos controlados
          </h1>
          <Funnel className="h-48" data={data.byTrim} />
        </div>

        <div className="col-start-3">
          <h1 className="text-center">
            {citymis.totalDenuncias} Denuncias telefonicas
          </h1>
          <Funnel className="h-48" data={citymis.byTrim} />
        </div>
        <Bars
          data={data.byMes}
          keys={['autos', 'motos', 'camiones']}
          indexBy={'label'}
          enableGridY={false}
          maxValue={Math.max(
            ...data.byMes.map((d) => d.autos + d.motos + d.camiones),
          )}
          enableGridX={false}
          axisLeft={null}
        />
        <Bars
          data={citymis.byMes}
          className="col-start-3"
          indexBy={'label'}
          maxValue={Math.max(...citymis.byMes.map((d) => d.value))}
          enableGridY={false}
          enableGridX={false}
          axisLeft={null}
        />
        <div className="col-start-2 row-start-1">
          <Image
            src={BannerSubsecretaria}
            alt="Banners SubSecretarial"
            height={80}
            className="mx-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-semibold">
            {Intl.DateTimeFormat('es', { dateStyle: 'full' }).format(
              Date.now(),
            )}
          </h2>
        </div>
        <div className="col-start-2 row-start-2 text-center justify-self-center">
          <h1 className="mb-2">Tiempos de respuesta</h1>
          <div className="flex gap-3">
            {citymis.byDuracion.map(({ label, value, id }) => (
              <div key={id}>
                <h2 className="text-4xl">{timeDiffCalc(value)}</h2>
                <p className="text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-5/6 mx-auto justify-between row-span-2 col-span-3">
          <Speedometer
            value={ultimoMes!.motos}
            customSegmentStops={[
              0,
              Math.ceil(UtilsMotos.normalization / 1.7),
              Math.ceil(UtilsMotos.normalization / 1.1),
              UtilsMotos.EsperadoMotos[CURRENT_MONTH],
            ]}
            maxValue={UtilsMotos.EsperadoMotos[CURRENT_MONTH]}
            targetValue={UtilsMotos.normalization}
            label="Control de Motos"
          />
          <Speedometer
            value={ultimoMes!.camiones}
            customSegmentStops={[
              0,
              Math.ceil(UtilsCamiones.normalization / 1.7),
              Math.ceil(UtilsCamiones.normalization / 1.1),
              UtilsCamiones.EsperadoCamiones[CURRENT_MONTH],
            ]}
            maxValue={UtilsCamiones.EsperadoCamiones[CURRENT_MONTH]}
            targetValue={UtilsCamiones.normalization}
            label="Control de Camiones"
          />
          <Speedometer
            value={ultimoMes!.autos}
            customSegmentStops={[
              0,
              Math.ceil(UtilsAutos.normalization / 1.7),
              Math.ceil(UtilsAutos.normalization / 1.1),
              UtilsAutos.EsperadoAutos[CURRENT_MONTH],
            ]}
            maxValue={UtilsAutos.EsperadoAutos[CURRENT_MONTH]}
            targetValue={UtilsAutos.normalization}
            label="Control de Autos"
          />
        </div>
      </div>
    </TabsContent>
  )
}
