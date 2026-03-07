'use client';

import { cn } from '@/lib/utils';
import { Timeframe, TIMEFRAME_CONFIG } from '@/lib/types';
import { Button } from './ui/button';

interface TimeframeSelectorProps {
  current: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

export function TimeframeSelector({ current, onChange }: TimeframeSelectorProps) {
  const timeframes = Object.entries(TIMEFRAME_CONFIG) as [Timeframe, (typeof TIMEFRAME_CONFIG)['3m']][];

  return (
    <div className='relative z-10 px-5 pb-2 flex justify-center'>
      <div className='flex gap-0.5 bg-card rounded-full p-2 border border-white/4 w-fit'>
        {timeframes.map(([key, config]) => (
          <Button key={key} onClick={() => onChange(key)} variant={current === key ? 'default' : 'ghost'}>
            {config.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
