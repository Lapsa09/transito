'use client'

import { ResponsiveFunnel, FunnelSvgProps, FunnelDatum } from '@nivo/funnel'
import React from 'react'

type Props = Omit<FunnelSvgProps<FunnelDatum>, 'height' | 'width'> & {
  className?: string
}

function Funnel({ data, className }: Props) {
  return (
    <div className={className}>
      <ResponsiveFunnel
        data={data}
        margin={{ top: 20, bottom: 20, left: 60 }}
        interpolation="linear"
        shapeBlending={0}
        spacing={10}
        colors={{ scheme: 'paired' }}
        borderWidth={0}
        borderOpacity={0}
        labelColor={{
          from: 'color',
          modifiers: [['darker', 3]],
        }}
        beforeSeparatorLength={20}
        beforeSeparatorOffset={20}
        afterSeparatorLength={20}
        afterSeparatorOffset={20}
        currentPartSizeExtension={10}
        currentBorderWidth={40}
        animate={false}
        motionConfig="wobbly"
        layers={[
          'separators',
          'parts',
          'annotations',
          'labels',
          (chart) => {
            return (
              <>
                {chart.parts.map((part) => {
                  return (
                    <g key={part.data.id}>
                      <text
                        x={part.x - part.x * 1.2}
                        y={part.y + part.height / 2}
                        textAnchor="left"
                        className="font-bold"
                        dominantBaseline="left"
                      >
                        {part.data.label}
                      </text>
                    </g>
                  )
                })}
              </>
            )
          },
        ]}
      />
    </div>
  )
}

export default Funnel
