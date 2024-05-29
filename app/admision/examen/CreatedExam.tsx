'use client'

import React from 'react'
import {
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
} from '@nextui-org/react'
import { examen } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { terminarExamen } from '@/services/actions'
import { DateTime } from 'luxon'

function CreatedExam({ examen }: { examen: examen }) {
  const router = useRouter()
  return (
    <Card>
      <CardHeader>
        <h1>
          Fecha:{' '}
          {DateTime.fromISO(`${examen.fecha}`)
            .toUTC()
            .toLocaleString(DateTime.DATE_SHORT)}
        </h1>
      </CardHeader>
      <CardBody>
        <p>
          Hora:{' '}
          {DateTime.fromISO(`${examen.hora}`).toUTC().toISOTime({
            extendedZone: false,
            suppressSeconds: true,
            suppressMilliseconds: true,
            includeOffset: false,
          })}
        </p>
      </CardBody>
      <CardFooter>
        <ButtonGroup>
          <Button
            onClick={() => router.push('/admision/examen/' + examen.clave)}
            className="bg-primary-400 text-white"
          >
            Ir a examen
          </Button>
          <Button
            onClick={async () => {
              await terminarExamen(examen.id)
              router.refresh()
            }}
            className="bg-danger-400 text-white"
          >
            Terminar examen
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}

export default CreatedExam
