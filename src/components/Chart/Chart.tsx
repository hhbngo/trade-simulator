import React from 'react';
import {
  LineChart,
  Line,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface Props {
  data: { name: number; min: number; avg: number; max: number }[];
  DD?: number;
}

const Chart: React.FC<Props> = ({ DD, data }) => {
  return (
    <div style={{ height: '350px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: window.screen.width > 863 ? 30 : 15,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {DD && <ReferenceLine y={DD} label="Drawdown limit" stroke="pink" />}
          <Line type="monotone" dataKey="max" stroke="#7DDBD5" />
          <Line type="monotone" dataKey="avg" stroke="#7db9e0" />
          <Line type="monotone" dataKey="min" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
