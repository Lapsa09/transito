'use client'

import Button from '@/components/Button'
import React from 'react'
import { habilitarExamen } from './actions'

function BeginButton({ id }: { id: number }) {
  return (
    <Button onClick={async () => habilitarExamen(id)}>Comenzar examen</Button>
  )
}

export default BeginButton
