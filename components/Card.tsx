'use client'
import { Card, Typography } from '@material-tailwind/react'
import { PropsWithChildren } from 'react'
import {
  FaCarSide,
  FaParking,
  FaTruckMoving,
  FaShuttleVan,
  FaUserNurse,
} from 'react-icons/fa'
import { RiMotorbikeFill } from 'react-icons/ri'
import { BsFillPersonFill } from 'react-icons/bs'
import { MdFiberNew } from 'react-icons/md'

import Link from 'next/link'

function CardWithLink({ children, link }: PropsWithChildren<{ link: string }>) {
  return (
    <Card className="mt-6 w-96 h-40">
      <Link
        className="w-full h-full bg-green-400 capitalize flex flex-col p-4 items-center justify-center rounded-md hover:text-green-50 duration-200"
        href={link}
      >
        {children}
      </Link>
    </Card>
  )
}

export function AutosLinkCard() {
  return (
    <CardWithLink link="/operativos/autos">
      <FaCarSide className="text-6xl" />
      <Typography className="text-4xl">Autos</Typography>
    </CardWithLink>
  )
}

export function MotosLinkCard() {
  return (
    <CardWithLink link="/operativos/motos">
      <RiMotorbikeFill className="text-6xl" />
      <Typography className="text-4xl">Motos</Typography>
    </CardWithLink>
  )
}

export function CamionesLinkCard() {
  return (
    <CardWithLink link="/operativos/camiones">
      <FaTruckMoving className="text-6xl" />
      <Typography className="text-4xl">Camiones</Typography>
    </CardWithLink>
  )
}

export function PaseoRioLinkCard() {
  return (
    <CardWithLink link="/operativos/paseo">
      <FaParking className="text-6xl" />
      <Typography className="text-4xl">Paseo del Rio</Typography>
    </CardWithLink>
  )
}

export function ClientesLinkCard() {
  return (
    <CardWithLink link="/sueldos/clientes">
      <BsFillPersonFill className="text-6xl" />
      <Typography className="text-4xl">Clientes</Typography>
    </CardWithLink>
  )
}

export function ServiciosLinkCard() {
  return (
    <CardWithLink link="/sueldos/servicios">
      <FaShuttleVan className="text-6xl" />
      <Typography className="text-4xl">Servicios</Typography>
    </CardWithLink>
  )
}

export function OperariosLinkCard() {
  return (
    <CardWithLink link="/sueldos/operarios">
      <FaUserNurse className="text-6xl" />
      <Typography className="text-4xl">Operarios</Typography>
    </CardWithLink>
  )
}

export function LiquidacionesLinkCard() {
  return (
    <CardWithLink link="/sueldos/liqui">
      <FaParking className="text-6xl" />
      <Typography className="text-4xl">Liquidaciones</Typography>
    </CardWithLink>
  )
}

export function NewServicioLinkCard() {
  return (
    <CardWithLink link="/servicios/create">
      <MdFiberNew className="text-6xl" />
      <Typography className="text-4xl">Nuevo Servicio</Typography>
    </CardWithLink>
  )
}
