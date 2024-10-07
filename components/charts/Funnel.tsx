'use client'

import { ResponsiveFunnel, FunnelSvgProps, FunnelDatum } from '@nivo/funnel'
import React from 'react'

type Props = Omit<FunnelSvgProps<FunnelDatum>, 'height' | 'width'> & {
  className?: string
}

function Funnel({ data, className, margin, ...props }: Props) {
  return (
    <div className={className}>
      <ResponsiveFunnel
        {...props}
        data={data}
        margin={{ top: 20, bottom: 20, left: 60, ...margin }}
        interpolation="linear"
        shapeBlending={0}
        spacing={10}
        colors={{ scheme: 'paired' }}
        borderWidth={0}
        borderOpacity={0}
        labelColor="black"
        currentPartSizeExtension={10}
        currentBorderWidth={40}
        animate={false}
        layers={[
          'separators',
          (chart) => {
            return (
              <>
                {chart.parts.map((part) => {
                  return (
                    <path
                      key={part.data.id}
                      d={`M ${part.width ? part.x0 + 50 : part.x0} ${part.y0} H ${part.width ? part.x1 - 50 : part.x1} V ${part.y1} H ${part.width ? part.x0 + 50 : part.x0} Z`}
                      fill={part.color}
                    />
                  )
                })}
              </>
            )
          },
          (chart) => {
            return (
              <>
                {chart.parts.map((part) => {
                  return (
                    <g key={part.data.id}>
                      <text
                        textAnchor="middle"
                        className="font-bold"
                        dominantBaseline="central"
                        x={part.x}
                        y={part.y}
                      >
                        {typeof props.valueFormat === 'function'
                          ? props.valueFormat(part.data.value)
                          : part.data.value}
                      </text>
                    </g>
                  )
                })}
              </>
            )
          },
          (chart) => {
            return (
              <>
                {chart.parts.map((part) => {
                  return (
                    <g key={part.data.id}>
                      <text
                        x={part.x - part.x * 1.2}
                        y={part.y}
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
