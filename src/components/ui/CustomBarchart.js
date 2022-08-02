import React from 'react';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';

function CustomBarchart({ data }) {
  return (
    <BarChart width={1500} height={500} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="zona" />
      <YAxis domain={[0, 5000]} />
      <Tooltip content={<CustomTooltip payload={data} />} />
      <Legend />
      <Bar dataKey="mañana" name="Mañana" stackId="a" fill="#8884d8" />
      <Bar dataKey="tarde" name="Tarde" stackId="a" fill="#82ca9d" />
    </BarChart>
  );
}

const CustomTooltip = (props) => {
  if (props.payload[0] != null) {
    const newPayload = [
      ...props.payload,
      {
        name: 'Total',
        value: props.payload[0].payload.total,
        color: '#f25658',
      },
    ];
    return <DefaultTooltipContent {...props} payload={newPayload} />;
  }
  return <DefaultTooltipContent {...props} />;
};

export default CustomBarchart;
