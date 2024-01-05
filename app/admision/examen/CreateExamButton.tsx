'use client'

import Button from '@/components/Button'
import { setter } from '@/services'
import { useRouter } from 'next/navigation'
import React from 'react'

function CreateExamButton() {
  const router = useRouter()
  const onClick = async () => {
    const clave = await setter({ route: '/admision/examen' })
    router.push('/admision/examen/' + clave)
  }
  return <Button onClick={onClick}>Crear examen</Button>
}

export default CreateExamButton
