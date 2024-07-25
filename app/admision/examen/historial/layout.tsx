import React from 'react'

interface LayoutProps {
  modal: React.ReactNode
  children: React.ReactNode
}

function layout({ modal, children }: LayoutProps) {
  return (
    <div>
      {modal}
      {children}
    </div>
  )
}

export default layout
