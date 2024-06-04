'use client'
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
} from '@nextui-org/react'
import { IoIosRefresh } from 'react-icons/io'
import { rinde_examen, tipo_examen } from '@prisma/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import React from 'react'
import RespuestasAlumnoCard from './RespuestasAlumno'
import { rehabilitarExamen, revalidar } from '@/services/actions'

function AlumnoCard({
  alumno,
}: {
  alumno: rinde_examen & { tipo_examen: tipo_examen }
}) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <h1>{alumno.nombre + ' ' + alumno.apellido}</h1>
        <IoIosRefresh
          onClick={() => {
            revalidar('examen')
            router.refresh()
          }}
          className="cursor-pointer ml-3"
        />
      </CardHeader>
      <CardBody>
        <p>DNI: {alumno.dni}</p>
        <Accordion isCompact>
          <AccordionItem title="Mas informacion">
            <p>Rinde examen de: {alumno.tipo_examen.tipo}</p>

            <p>
              Estado del examen:
              {!alumno.utilizado
                ? 'No ingresado'
                : !alumno.hora_finalizado && !alumno.nota
                  ? 'Ingresado'
                  : 'Finalizado'}
            </p>
            <p>
              {alumno.utilizado && alumno.hora_finalizado && (
                <Button
                  onClick={async () => {
                    await rehabilitarExamen(alumno.id)
                    router.refresh()
                  }}
                >
                  Rehabilitar alumno
                </Button>
              )}
            </p>
            <p>
              Hora de ingreso:
              {alumno.hora_ingresado
                ? new Date(alumno.hora_ingresado).toLocaleString()
                : ''}
            </p>
            <p>
              Hora de finalizado:
              {alumno.hora_finalizado
                ? new Date(alumno.hora_finalizado).toLocaleString()
                : ''}
            </p>
            <p>Nota: {alumno.nota || ''}</p>
            {alumno.nota && <RespuestasAlumnoCard id={alumno.id} />}
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  )
}

export default AlumnoCard
