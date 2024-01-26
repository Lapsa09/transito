'use client'

import Button from '@/components/Button'
import { setter } from '@/services'
import { useRouter } from 'next/navigation'
import React from 'react'

function CreateExamButton() {
  const router = useRouter()
  const onClick = async () => {
    try {
      const examen = await setter({ route: 'admision/examen', body: {} })
      router.push('/admision/examen/' + examen.clave)
    } catch (error: any) {
      console.log(error)
    }
  }
  return <Button onClick={onClick}>Crear examen</Button>
}

export default CreateExamButton
