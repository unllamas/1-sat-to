'use client';

import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceData, Currency, SUPPORTED_CURRENCIES } from '@/lib/types';
import { Dollar } from './icon/dollar';

interface PriceDisplayProps {
  price: PriceData | null;
  priceChange: number | null;
  timeframeLabel: string;
}

export function formatSatPrice(price: number): string {
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  return price.toFixed(6);
}

export function PriceDisplay({ price, priceChange, timeframeLabel }: PriceDisplayProps) {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === price?.currency) || SUPPORTED_CURRENCIES[0];

  return (
    <div className='relative z-10 px-5 pt-5 pb-3 flex flex-col items-center text-center'>
      {/* <div className='flex items-center gap-2 mb-1'>
        <div className='w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse' />
        <span className='text-neutral-400 text-xs font-medium tracking-widest uppercase'>En vivo</span>
      </div> */}

      <div className='flex items-center gap-2 mt-0.5'>
        <span className='text-neutral-400 text-md font-medium'>1 SAT =</span>
      </div>

      <div className='flex items-end gap-2'>
        <div className='flex items-center gap-2'>
          <div className='text-muted-foreground'>
            <Dollar />
          </div>
          <span className='text-white text-5xl font-bold tracking-tight tabular-nums'>
            {price ? formatSatPrice(price.satPrice) : '—'}
          </span>
        </div>
        <span className='text-neutral-400 text-lg font-medium'>{price?.currency || 'MXN'}</span>
      </div>

      <div className='flex items-center gap-3 mt-1.5'>
        {priceChange !== null ? (
          <span className={`text-xs font-medium ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChange >= 0 ? '+' : ''}
            {Number(priceChange.toFixed(2)).toLocaleString('es-ES')}% ({timeframeLabel})
          </span>
        ) : (
          <span className='text-xs font-medium text-neutral-500'>Cargando...</span>
        )}
        {price && (
          <span className='text-neutral-600 text-[11px]'>
            {new Date(price.timestamp).toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  );
}
