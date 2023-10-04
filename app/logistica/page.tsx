import React from 'react'
import Link from 'next/link'

function page() {
  return (
    <div>
      <h1>Logistica</h1>
      <Link href={'/logistica/vehiculos'}>Vehiculos</Link>
      <Link href={'/logistica/repuestos/pedidos'}>Pedidos</Link>
      <Link href={'/logistica/repuestos/reparaciones'}>Reparaciones</Link>
      <Link href={'/logistica/repuestos/proveedores'}>Proveedores</Link>
    </div>
  )
}

export default page
