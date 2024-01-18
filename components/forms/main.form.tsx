'use client'
import { useStepForm } from '@/hooks'
import React, { useRef } from 'react'
import { Variants, motion } from 'framer-motion'

function MainForm({ children }: { children: React.ReactNode[] }) {
  const { activeStep } = useStepForm()
  const refs = useRef<HTMLDivElement[]>([])

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
          ref={(el) => el && refs.current.push(el)}
          animate={
            activeStep === i ? 'open' : activeStep > i ? 'left' : 'right'
          }
          className="w-full flex-col"
          style={{ minHeight: '500px' }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export default MainForm
