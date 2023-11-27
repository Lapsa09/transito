'use client'
import { useStepForm } from '@/hooks'
import React from 'react'
import { Variants, motion } from 'framer-motion'

function MainForm({ steps }: { steps: React.ReactNode[] }) {
  const { activeStep } = useStepForm()

  const variant: Variants = {
    open: {
      x: 0,
      display: 'flex',
    },
    left: {
      x: '-120vw',
      display: 'none',
    },
    right: {
      x: '120vw',
      display: 'none',
    },
  }
  return (
    <div className="flex w-full mx-auto my-4">
      {steps.map((child: React.ReactNode, i: number) => (
        <motion.div
          variants={variant}
          key={i}
          animate={
            activeStep === i ? 'open' : activeStep > i ? 'left' : 'right'
          }
          className="w-full flex-col min-h-[452px]"
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export default MainForm
