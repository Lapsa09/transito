import { TabsContent } from '@/components/ui/tabs'

import React from 'react'
import PageClient from './page.client'

function route() {
  return (
    <TabsContent value="/otros">
      <PageClient />
    </TabsContent>
  )
}

export default route
