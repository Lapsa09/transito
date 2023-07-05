'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { AutosForm } from '@/components/forms'
import { useStepForm } from '@/hooks'

function page() {
  const { activeStep } = useStepForm()

  const variant = {
    open: {
      x: `-${activeStep * 100}%`,
    },
    left: {
      x: '-120vw',
    },
    right: {
      x: '120vw',
    },
  }
  return (
    <div className="flex w-[200%] mx-auto my-4">
      {AutosForm.map((child: React.ReactNode, i: number) => (
        <motion.div
          variants={variant}
          key={i}
          className="w-full flex flex-col"
          animate={
            activeStep === i ? 'open' : activeStep > i ? 'left' : 'right'
          }
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export default page
