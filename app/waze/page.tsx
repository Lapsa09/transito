import { PotHoleCard, TrafficCard } from '@/components/Card'
import React from 'react'

function page() {
  return (
    <div className="flex gap-5 justify-center flex-wrap">
      <TrafficCard />
      <PotHoleCard />
    </div>
  )
}

export default page
