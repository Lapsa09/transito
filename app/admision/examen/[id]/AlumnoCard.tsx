'use client'
import Button from '@/components/Button'
import CustomSelect from '@/components/Select'
import { RegularForm } from '@/components/forms/layout.form'
import { updater } from '@/services'
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react'
import { rinde_examen, tipo_examen } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { Key } from 'react'

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
    }).then(() => router.refresh())

  return (
    <Card>
      <CardHeader>
        <h1>{alumno.nombre + ' ' + alumno.apellido}</h1>
      </CardHeader>
      <CardBody>
        <p>DNI: {alumno.dni}</p>

        {alumno.tipo_examen ? (
          <p>Rinde examen de: {alumno.tipo_examen.tipo}</p>
        ) : (
          <Accordion isCompact>
            <AccordionItem title="Elegir que examen va a rendir">
              <RegularForm onSubmit={editarTipoExamen}>
                <CustomSelect
                  label="Tipo de examen"
                  options={tipos_examen}
                  name="tipo_examen"
                />
                <Button type="submit">Guardar</Button>
              </RegularForm>
            </AccordionItem>
          </Accordion>
        )}
      </CardBody>
    </Card>
  )
}

export default AlumnoCard
