'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { terminarExamen } from '@/services/actions'

function QuitButton({ id }: { id: number }) {
  return (
    <Button onClick={async () => await terminarExamen(id)}>
      Terminar examen
    </Button>
  )
}

export default QuitButton
