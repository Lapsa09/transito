'use client'

import Button from '@/components/Button'
import { getter } from '@/services'
import { useRouter } from 'next/navigation'
import React from 'react'

function CreateExamButton() {
  const router = useRouter()
  const onClick = async () => {
    try {
      const examen = await getter({ route: 'admision/examen' })
      router.push('/admision/examen/' + examen.clave)
    } catch (error: any) {
      console.log(error.response.data)
    }
  }
  return <Button onClick={onClick}>Crear examen</Button>
}

export default CreateExamButton
