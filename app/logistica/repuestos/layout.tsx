import React from 'react'
import LayoutClient from './layout.client'

function layout({ children }: React.PropsWithChildren) {
  return <LayoutClient>{children}</LayoutClient>
}

export default layout
