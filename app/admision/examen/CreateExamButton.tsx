'use client'

import Button from '@/components/Button'
import { fetcher } from '@/services'
import { examen } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'

function CreateExamButton() {
  const router = useRouter()
  const onClick = async () => {
    try {
      const res = await fetcher('api/admision/examen', { method: 'POST' })
      const examen: examen = await res.json()
      router.push('/admision/examen/' + examen.clave)
    } catch (error: any) {
      console.log(error)
    }
  }
  return <Button onClick={onClick}>Crear examen</Button>
}

export default CreateExamButton
