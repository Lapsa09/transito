'use client'

import { Button } from '@/components/ui/button'
import { Examen } from '@/drizzle/schema/examen'
import { fetcher } from '@/services'
import { useRouter } from 'next/navigation'
import React from 'react'

function CreateExamButton() {
  const router = useRouter()
  const onClick = async () => {
    try {
      const res = await fetcher('api/admision/examen', { method: 'POST' })
      const examen: Examen = await res.json()
      router.push('/admision/examen/' + examen.clave)
    } catch (error: any) {
      console.log(error)
    }
  }
  return <Button onClick={onClick}>Crear examen</Button>
}

export default CreateExamButton
