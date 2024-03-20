'use client'
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
} from '@nextui-org/react'
import { IoIosRefresh } from 'react-icons/io'
import { RegularForm } from '@/components/forms/layout.form'
import { rinde_examen, tipo_examen } from '@prisma/client'
import { updater } from '@/services'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import CustomSelect from '@/components/Select'
import React, { Key } from 'react'
import RespuestasAlumnoCard from './RespuestasAlumno'
import { rehabilitarExamen, revalidar } from '@/services/actions'

const tipos_examen = [
  { id: 1, label: 'AUTOS' },
  { id: 2, label: 'MOTOVEHICULO Y PARTICULAR' },
  { id: 3, label: 'PROFESIONAL C1, C2, C3, D2, D3, E1, E2' },
  { id: 4, label: 'PROFESIONAL D1, TAXI - REMIS, D4 EMERGENCIAS' },
]

function AlumnoCard({
  alumno,
}: {
  alumno: rinde_examen & { tipo_examen?: tipo_examen }
}) {
  const router = useRouter()
  const editarTipoExamen = async ({ tipo_examen }: { tipo_examen: Key }) =>
    await updater({
      route: `admision/examen/${alumno.id}`,
      body: { tipo_examen },
    }).then(router.refresh)

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
            {alumno.tipo_examen ? (
              <p>Rinde examen de: {alumno.tipo_examen.tipo}</p>
            ) : (
              <RegularForm onSubmit={editarTipoExamen}>
                <CustomSelect
                  label="Tipo de examen"
                  options={tipos_examen}
                  name="tipo_examen"
                />
                <Button type="submit">Guardar</Button>
              </RegularForm>
            )}

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
