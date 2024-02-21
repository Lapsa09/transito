import React, { PropsWithChildren } from 'react'
import LayoutClient from './layout.client'

function layout({ children }: PropsWithChildren) {
  return <LayoutClient>{children}</LayoutClient>
}

export default layout
