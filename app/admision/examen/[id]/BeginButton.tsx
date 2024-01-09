'use client'

import Button from '@/components/Button'
import React from 'react'
import { habilitarExamen } from '@/services/actions'
import { toast } from '@/hooks'

function BeginButton({ id }: { id: number }) {
  return (
    <Button
      onClick={async () => {
        await habilitarExamen(id)
        toast({ title: 'El examen comenzo', variant: 'success' })
      }}
    >
      Comenzar examen
    </Button>
  )
}

export default BeginButton
