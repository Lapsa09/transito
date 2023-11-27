'use client'
import { Card, Typography } from '@material-tailwind/react'
import { PropsWithChildren } from 'react'
import {
  FaCarSide,
  FaParking,
  FaTruckMoving,
  FaShuttleVan,
  FaUserNurse,
  FaTruckPickup,
  FaWrench,
  FaTrafficLight,
} from 'react-icons/fa'
import { RiMotorbikeFill } from 'react-icons/ri'
import { BsCartPlus, BsFillPersonFill } from 'react-icons/bs'
import { MdAttachMoney, MdDeliveryDining, MdFiberNew } from 'react-icons/md'
import { GiAutoRepair, GiHole } from 'react-icons/gi'

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
    <CardWithLink link="/operativos/rio">
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
    <CardWithLink link="/sueldos/servicios/create">
      <MdFiberNew className="text-6xl" />
      <Typography className="text-4xl">Nuevo Servicio</Typography>
    </CardWithLink>
  )
}

export function ActualizarPreciosCard() {
  return (
    <CardWithLink link="/sueldos/precios">
      <MdAttachMoney className="text-6xl" />
      <Typography className="text-4xl">Actualizar Precios</Typography>
    </CardWithLink>
  )
}

export function MovilesCard() {
  return (
    <CardWithLink link="/logistica/vehiculos">
      <FaTruckPickup className="text-6xl" />
      <Typography className="text-4xl">Moviles</Typography>
    </CardWithLink>
  )
}

export function PedidosCard() {
  return (
    <CardWithLink link="/logistica/repuestos/pedidos">
      <MdDeliveryDining className="text-6xl" />
      <Typography className="text-4xl">Pedidos</Typography>
    </CardWithLink>
  )
}

export function ReparacionesCard() {
  return (
    <CardWithLink link="/logistica/repuestos/reparaciones">
      <FaWrench className="text-6xl" />
      <Typography className="text-4xl">Reparaciones</Typography>
    </CardWithLink>
  )
}

export function ProveedoresCard() {
  return (
    <CardWithLink link="/logistica/repuestos/proveedores">
      <BsCartPlus className="text-6xl" />
      <Typography className="text-4xl">Proveedores</Typography>
    </CardWithLink>
  )
}

export function RepuestosCard() {
  return (
    <CardWithLink link="/logistica/repuestos">
      <GiAutoRepair className="text-6xl" />
      <Typography className="text-4xl">Repuestos</Typography>
    </CardWithLink>
  )
}

export function PotHoleCard() {
  return (
    <CardWithLink link="/operativos/pothole">
      <GiHole className="text-6xl" />
      <Typography className="text-4xl">Baches</Typography>
    </CardWithLink>
  )
}

export function TrafficCard() {
  return (
    <CardWithLink link="/operativos/traffic">
      <FaTrafficLight className="text-6xl" />
      <Typography className="text-4xl">Trafico</Typography>
    </CardWithLink>
  )
}
