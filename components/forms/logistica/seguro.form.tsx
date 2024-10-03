'use client'

import { Button } from '@/components/ui/button'
import { setter } from '@/services'
import React, { useRef } from 'react'
import { mutate } from 'swr'
import Link from 'next/link'
import { VehiculoDTO } from '@/DTO/logistica/vehiculos'

function SeguroForm({ movil }: { movil: VehiculoDTO }) {
  const { patente, seguro } = movil
  const ref = useRef<HTMLInputElement>(null)

  const onSubmit = async (data: { seguro: File }) => {
    await mutate<VehiculoDTO[]>(
      { route: 'logistica/vehiculos' },
      async (moviles) => {
        const movil = await setter<VehiculoDTO>({
          route: `logistica/vehiculos/${patente}/seguro`,
          body: data,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        })

        if (moviles) {
          return moviles.map((m) => {
            return m.patente.toLowerCase() === patente.toLowerCase() ? movil : m
          })
        }
        return [movil]
      },
    )
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const seguro = e.target.files?.[0]
    if (seguro) await onSubmit({ seguro })
  }

  return (
    <>
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
        ref={ref}
      />
      <Button
        className="bg-green-500 hover:bg-green-700"
        onClick={() => ref.current?.click()}
      >
        {seguro ? 'Actualizar seguro' : 'Subir seguro'}
      </Button>
      {seguro ? (
        <Link href={seguro} target="_blank">
          <Button className="bg-blue-500 hover:bg-blue-700">Ver seguro</Button>
        </Link>
      ) : null}
    </>
  )
}

export default SeguroForm
