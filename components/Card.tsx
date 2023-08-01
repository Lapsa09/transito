'use client'
import { Card, Typography } from '@material-tailwind/react'
import { PropsWithChildren } from 'react'
import { FaCarSide, FaParking, FaTruckMoving } from 'react-icons/fa'
import { RiMotorbikeFill } from 'react-icons/ri'

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
