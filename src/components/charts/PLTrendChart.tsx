/**
 * P&L Trend Chart
 * Line chart for profit/loss over time
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PLTrendChartProps {
  data: Array<{
    date: string;
    pnl: number;
  }>;
}

export default function PLTrendChart({ data }: PLTrendChartProps) {
  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="date" 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
          tickFormatter={formatCurrency}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1e293b', 
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Area 
          type="monotone" 
          dataKey="pnl" 
          stroke="#10b981" 
          strokeWidth={2}
          fill="url(#colorPnl)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
