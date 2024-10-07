'use client'

import React from 'react'
import { dashboards } from '@/lib/dashboards'
import { Tab, Tabs } from '@nextui-org/react'

function PageClient() {
  return (
    <Tabs items={dashboards} itemID="name">
      {(dashboard) => (
        <Tab key={dashboard.name} title={dashboard.name}>
          <iframe
            title="Tablero Accidentes"
            width="1200"
            height="700"
            src={dashboard.url}
            allowFullScreen={true}
          ></iframe>
        </Tab>
      )}
    </Tabs>
  )
}

export default PageClient
