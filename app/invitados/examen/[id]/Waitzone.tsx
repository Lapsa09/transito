import React from 'react'
import { Spinner } from '@nextui-org/react'

function Waitzone() {
  return (
    <div className="text-center mt-5">
      <h2>Zona de espera</h2>
      <p>El examen aún no ha comenzado</p>
      <Spinner size="lg" />
    </div>
  )
}

export default Waitzone
