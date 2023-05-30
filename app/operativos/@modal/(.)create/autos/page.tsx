'use client'
import { AutosForm } from '@/components'
import { useStepForm } from '@/hooks'
import React from 'react'
import { twMerge } from 'tailwind-merge'

function page() {
  const { activeStep } = useStepForm()
  return (
    <div className="flex w-10/12 my-4">
      {AutosForm.map((child: React.ReactNode, i: number) => (
        <div
          key={i}
          className={twMerge(
            `w-full flex flex-col`,
            i !== activeStep && 'hidden'
          )}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export default page
