'use client'
import { useStepForm } from '@/hooks'
import React from 'react'
import { Variants, motion } from 'framer-motion'

function MainForm({ children }: { children: React.ReactNode[] }) {
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
      {children.map((child, i) => (
        <motion.div
          variants={variant}
          key={i}
          animate={
            activeStep === i ? 'open' : activeStep > i ? 'left' : 'right'
          }
          className="w-full flex-col"
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export default MainForm
