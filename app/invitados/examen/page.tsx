import { getter } from '@/services'
import { Question } from '@/types/quiz'
import React from 'react'
import Quiz from './Quiz'

async function page() {
  const preguntas = await getter<Question[]>({ route: '/operativos/examen' })
  return (
    <div>
      <h1>Examen</h1>

      <Quiz preguntas={preguntas} />
    </div>
  )
}

export default page
