'use client'

import React from 'react'
import { Funnel } from '@/components/charts'
import { SustanciasMetrics } from '@/DTO/operativos/metrics'

type Props = {
  data: SustanciasMetrics
}

function PageClient({ data }: Props) {
  const groupedData = [
    { id: 0, value: data.total, label: 'TOTAL' },
    ...data.sustancias,
  ]
  return (
    <Funnel
      margin={{ left: 180 }}
      className="h-[700px]"
      valueFormat={(value) =>
        `${value} (${Math.round((value / data.total) * 100)}%)`
      }
      data={groupedData}
    />
  )
}

export default PageClient
