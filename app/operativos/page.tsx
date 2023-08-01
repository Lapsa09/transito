import {
  AutosLinkCard,
  CamionesLinkCard,
  MotosLinkCard,
  PaseoRioLinkCard,
} from '@/components/Card'
import React from 'react'

function page() {
  return (
    <div className="flex gap-5 justify-center flex-wrap">
      <AutosLinkCard />
      <MotosLinkCard />
      <CamionesLinkCard />
      <PaseoRioLinkCard />
    </div>
  )
}

export default page
