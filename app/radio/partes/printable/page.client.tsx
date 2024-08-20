'use client'

import { Parte } from '@/types/radio'
import { getLocalTime } from '@/utils/misc'
import React, { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

function ClientPage({ data }: { data: Parte[] }) {
  const ref = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => window.close(),
  })

  useEffect(() => {
    handlePrint()
  }, [])

  return (
    <div ref={ref} className="max-w-prose">
      {data.map((parte) => (
        <div
          key={parte.id}
          className="mx-auto p-5 text-left font-bold h-screen w-full pt-32"
        >
          <div>
            <p className="m-0 text-xl">{parte.turno}</p>
            <p className="m-0 text-xl">
              {new Date(parte.fecha).toLocaleDateString('es-AR', {
                dateStyle: 'full',
                timeZone: 'GMT',
              })}
            </p>
          </div>
          <div className="mt-5">
            <div className="flex gap-10 justify-between items-center w-full">
              <p className="m-0 text-2xl">
                {parte.legajo}- {parte.apellido} {parte.apellido}
              </p>
              <p className="float-right">Movil: {parte.movil}</p>
            </div>
            <p className="mt-5 text-xl uppercase">{parte.qth}</p>
            <div className="mt-8">
              <p className="m-0 text-xl">
                {getLocalTime(parte.hora_inicio.toString())} a{' '}
                {getLocalTime(parte.hora_fin.toString())}
              </p>
              <p className="m-0 text-xl">
                Descanso: {getLocalTime(parte.hora_descanso.toString())}-
                {getLocalTime(parte.hora_descanso_fin.toString())}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ClientPage
