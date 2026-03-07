'use client';

import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { HistoricalDataPoint } from '@/lib/types';

interface PriceChartProps {
  data: HistoricalDataPoint[];
  isLoading?: boolean;
}

export function PriceChart({ data, isLoading }: PriceChartProps) {
  const { chartData, isPositive } = useMemo(() => {
    if (!data.length) return { chartData: [], isPositive: true };

    const chartData = data.map((point) => ({
      time: point.time,
      value: point.value,
    }));

    const isPositive = data[data.length - 1].value >= data[0].value;

    return { chartData, isPositive };
  }, [data]);

  const lineColor = isPositive ? '#05df72' : '#ff6467';
  const gradientId = isPositive ? 'priceGradientUp' : 'priceGradientDown';

  if (isLoading || !chartData.length) {
    return (
      <div className='absolute z-0 bottom-0 w-full h-[65vh] flex items-center justify-center'>
        <div className='w-8 h-8 border-4 border-neutral-500/30 border-t-neutral-900 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <div className='absolute z-0 bottom-0 w-full h-[65vh]'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id='priceGradientUp' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#05df72' stopOpacity={0.25} />
              <stop offset='100%' stopColor='#05df72' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='priceGradientDown' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#ff6467' stopOpacity={0.25} />
              <stop offset='100%' stopColor='#ff6467' stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Area
            type='monotone'
            dataKey='value'
            stroke={lineColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
