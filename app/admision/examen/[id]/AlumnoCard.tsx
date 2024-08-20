'use client'
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
} from '@nextui-org/react'
import { IoIosRefresh } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import React from 'react'
import RespuestasAlumnoCard from './RespuestasAlumno'
import { rehabilitarExamen } from '@/services/actions'
import { Alumno } from '@/types/quiz'

function AlumnoCard({ alumno }: { alumno: Alumno }) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <h1>{alumno.usuario?.nombre + ' ' + alumno.usuario?.apellido}</h1>
        <IoIosRefresh
          onClick={router.refresh}
          className="cursor-pointer ml-3"
        />
      </CardHeader>
      <CardBody>
        <p>DNI: {alumno.usuario?.dni}</p>
        <Accordion isCompact>
          <AccordionItem title="Mas informacion">
            <p>Rinde examen de: {alumno.tipoExamen.tipo}</p>

            <p>
              Estado del examen:
              {!alumno.usuario?.utilizado
                ? 'No ingresado'
                : !alumno.horaFinalizado && !alumno.nota
                  ? 'Ingresado'
                  : 'Finalizado'}
            </p>
            <p>
              {alumno.usuario?.utilizado && (
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
              {alumno.horaIngresado
                ? new Date(alumno.horaIngresado).toLocaleString()
                : ''}
            </p>
            <p>
              Hora de finalizado:
              {alumno.horaFinalizado
                ? new Date(alumno.horaFinalizado).toLocaleString()
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
