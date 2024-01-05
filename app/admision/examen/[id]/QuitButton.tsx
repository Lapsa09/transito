'use client'

import Button from '@/components/Button'
import React from 'react'
import { terminarExamen } from './actions'

function QuitButton({ id }: { id: string }) {
  return (
    <Button onClick={async () => await terminarExamen(id)}>
      Terminar examen
    </Button>
  )
}

export default QuitButton
