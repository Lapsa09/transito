"use client";

import React from "react";
import { ResponsiveBar, BarDatum, ResponsiveBarSvgProps } from "@nivo/bar";
import { cn } from "@/lib/utils";

type Props = ResponsiveBarSvgProps<BarDatum> & {
  className?: string;
};

function Bars({ data, keys, indexBy, maxValue = 8000, ...props }: Props) {
  return (
    <div className={cn("max-h-72", props.className)}>
      <ResponsiveBar
        {...props}
        data={data}
        keys={keys}
        indexBy={indexBy}
        colors={{ scheme: "paired" }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        margin={{ top: 50, bottom: 50, left: 60 }}
        enableTotals
        enableLabel={false}
        padding={0.5}
        maxValue={maxValue}
      />
    </div>
  );
}

export default Bars;
