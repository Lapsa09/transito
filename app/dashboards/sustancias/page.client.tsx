'use client'

import React from 'react'
import { Funnel } from '@/components/charts'

type Props = {
  data: {
    sustancias: { id: string; value: number; label: string }[]
    total: number
  }
}

function PageClient({ data }: Props) {
  const groupedData = [
    { id: 'total', value: data.total, label: 'TOTAL' },
  ].concat(data.sustancias)
  return (
    <Funnel
      margin={{ left: 180 }}
      className="h-[700px]"
      valueFormat={(value) => `${value} (${(value / data.total) * 100}%)`}
      data={groupedData}
    />
  )
}

export default PageClient
