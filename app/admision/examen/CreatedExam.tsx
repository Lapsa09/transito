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
import { useRouter } from 'next/navigation'
import { terminarExamen } from '@/services/actions'
import { Examen } from '@/drizzle/schema/examen'
import { getLocalDate, getLocalTime } from '@/utils/misc'

function CreatedExam({ examen }: { examen: Examen }) {
  const router = useRouter()
  return (
    <Card>
      <CardHeader>
        <h1>Fecha: {getLocalDate(examen.fecha!)}</h1>
      </CardHeader>
      <CardBody>
        <p>Hora: {getLocalTime(examen.horaIniciado!)}</p>
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
