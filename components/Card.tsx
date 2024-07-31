'use client'
import { PropsWithChildren } from 'react'
import {
  FaCarSide,
  FaParking,
  FaTruckMoving,
  FaShuttleVan,
  FaUserNurse,
  FaTruckPickup,
  FaWrench,
} from 'react-icons/fa'
import { RiMotorbikeFill } from 'react-icons/ri'
import { BsCartPlus, BsFillPersonFill } from 'react-icons/bs'
import { MdAttachMoney, MdDeliveryDining, MdFiberNew } from 'react-icons/md'
import { GiAutoRepair } from 'react-icons/gi'

import Link from 'next/link'
import { Card } from '@nextui-org/react'

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
      <p className="text-4xl">Autos</p>
    </CardWithLink>
  )
}

export function MotosLinkCard() {
  return (
    <CardWithLink link="/operativos/motos">
      <RiMotorbikeFill className="text-6xl" />
      <p className="text-4xl">Motos</p>
    </CardWithLink>
  )
}

export function CamionesLinkCard() {
  return (
    <CardWithLink link="/operativos/camiones">
      <FaTruckMoving className="text-6xl" />
      <p className="text-4xl">Camiones</p>
    </CardWithLink>
  )
}

export function PaseoRioLinkCard() {
  return (
    <CardWithLink link="/operativos/rio">
      <FaParking className="text-6xl" />
      <p className="text-4xl">Paseo del Rio</p>
    </CardWithLink>
  )
}

export function ClientesLinkCard() {
  return (
    <CardWithLink link="/sueldos/clientes">
      <BsFillPersonFill className="text-6xl" />
      <p className="text-4xl">Clientes</p>
    </CardWithLink>
  )
}

export function ServiciosLinkCard() {
  return (
    <CardWithLink link="/sueldos/servicios">
      <FaShuttleVan className="text-6xl" />
      <p className="text-4xl">Servicios</p>
    </CardWithLink>
  )
}

export function OperariosLinkCard() {
  return (
    <CardWithLink link="/sueldos/operarios">
      <FaUserNurse className="text-6xl" />
      <p className="text-4xl">Operarios</p>
    </CardWithLink>
  )
}

export function LiquidacionesLinkCard() {
  return (
    <CardWithLink link="/sueldos/liqui">
      <FaParking className="text-6xl" />
      <p className="text-4xl">Liquidaciones</p>
    </CardWithLink>
  )
}

export function NewServicioLinkCard() {
  return (
    <CardWithLink link="/sueldos/servicios/create">
      <MdFiberNew className="text-6xl" />
      <p className="text-4xl">Nuevo Servicio</p>
    </CardWithLink>
  )
}

export function ActualizarPreciosCard() {
  return (
    <CardWithLink link="/sueldos/precios">
      <MdAttachMoney className="text-6xl" />
      <p className="text-4xl">Actualizar Precios</p>
    </CardWithLink>
  )
}

export function MovilesCard() {
  return (
    <CardWithLink link="/logistica/vehiculos">
      <FaTruckPickup className="text-6xl" />
      <p className="text-4xl">Moviles</p>
    </CardWithLink>
  )
}

export function PedidosCard() {
  return (
    <CardWithLink link="/logistica/repuestos/pedidos">
      <MdDeliveryDining className="text-6xl" />
      <p className="text-4xl">Pedidos</p>
    </CardWithLink>
  )
}

export function ReparacionesCard() {
  return (
    <CardWithLink link="/logistica/repuestos/reparaciones">
      <FaWrench className="text-6xl" />
      <p className="text-4xl">Reparaciones</p>
    </CardWithLink>
  )
}

export function ProveedoresCard() {
  return (
    <CardWithLink link="/logistica/repuestos/proveedores">
      <BsCartPlus className="text-6xl" />
      <p className="text-4xl">Proveedores</p>
    </CardWithLink>
  )
}

export function RepuestosCard() {
  return (
    <CardWithLink link="/logistica/repuestos">
      <GiAutoRepair className="text-6xl" />
      <p className="text-4xl">Repuestos</p>
    </CardWithLink>
  )
}
