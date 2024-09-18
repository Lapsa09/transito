'use client'

import React from 'react'
import ReactSpeedometer, {
  Props as SpeedometerProps,
} from 'react-d3-speedometer'

type Props = SpeedometerProps & {
  targetValue?: number
  label: string
}

function Speedometer({
  value,
  customSegmentStops,
  maxValue,
  targetValue,
  label,
}: Props) {
  return (
    <div>
      <ReactSpeedometer
        value={value! > maxValue! ? maxValue : value}
        segments={3}
        height={220}
        width={380}
        segmentValueFormatter={(value) => {
          if (!+value) return '0'
          if (+value === customSegmentStops?.[2]!)
            return targetValue!.toString()
          if (+value === maxValue) return maxValue.toString()
          return ''
        }}
        currentValueText={value?.toString()}
        customSegmentStops={customSegmentStops}
        maxValue={maxValue}
        segmentColors={['#FF0000', '#FFDD00', '#30B32D']}
      />
      <p className="text-center w-full">{label}</p>
    </div>
  )
}

export default Speedometer
