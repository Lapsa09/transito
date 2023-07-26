'use client'
import { useStepForm } from '@/hooks'
import React from 'react'
import { motion } from 'framer-motion'

function MainForm({ steps }: { steps: React.ReactNode[] }) {
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
      {steps.map((child: React.ReactNode, i: number) => (
        <motion.div
          variants={variant}
          key={i}
          animate={
            activeStep === i ? 'open' : activeStep > i ? 'left' : 'right'
          }
          className="w-full flex flex-col"
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export default MainForm
