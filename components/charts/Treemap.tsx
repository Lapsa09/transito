'use client'

import { TreeMap, TreeMapSvgProps, DefaultTreeMapDatum } from '@nivo/treemap'
import React from 'react'

type Props = TreeMapSvgProps<DefaultTreeMapDatum[]> & {}

function Treemap({ data, height, width }: Props) {
  return (
    <TreeMap
      data={{ id: 'Motivos', children: data }}
      height={height}
      width={width}
      colors={{ scheme: 'paired' }}
      leavesOnly
      orientLabel={false}
      margin={{ top: 50, bottom: 50, left: 60, right: 0 }}
    />
  )
}

export default Treemap
