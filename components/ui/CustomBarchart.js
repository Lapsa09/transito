import React from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

function CustomBarchart({ data }) {
  return (
    <BarChart width={1500} height={250} data={data}>
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis dataKey="zona" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="cantidad" fill="#8884d8" />
    </BarChart>
  );
}

export default CustomBarchart;
