import React from 'react'
import Modal from '@/components/Modal'
import LayoutClient from './layout.client'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <Modal>
      <LayoutClient>{children}</LayoutClient>
    </Modal>
  )
}

export default layout
