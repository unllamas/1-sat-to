'use client';

import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceData, Currency, SUPPORTED_CURRENCIES } from '@/lib/types';
import { Dollar } from './icon/dollar';

interface PriceDisplayProps {
  price: PriceData | null;
  displaySatPrice?: number; // ←←← NUEVO: valor del hover
  priceChange: number | null;
  timeframeLabel: string;
}

export function formatSatPrice(price: number): string {
  if (price >= 0.5) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(3);

  return price.toFixed(3);
}

const getTimeframeText = (tf: string) => {
  const map: Record<string, string> = {
    '3M': 'Últimos 3 meses',
    '6M': 'Últimos 6 meses',
    '1A': 'Año pasado',
    '5A': 'Últimos 5 años',
    // agrega más si tienes otros timeframes
  };
  return map[tf];
};

export function PriceDisplay({ price, displaySatPrice, priceChange, timeframeLabel }: PriceDisplayProps) {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === price?.currency) || SUPPORTED_CURRENCIES[0];

  // ←←← Usamos el valor del hover si existe, sino el precio actual
  const satPriceToShow = displaySatPrice ?? price?.satPrice ?? 0;

  const timeframeText = getTimeframeText(timeframeLabel);

  return (
    <div className='relative z-10 px-5 pt-5 pb-3 flex flex-col items-center text-center'>
      <div className='flex items-center gap-2 mt-0.5'>
        <span className='text-neutral-400 text-md font-medium'>1 SAT =</span>
      </div>

      <div className='flex items-end gap-2'>
        <div className='flex items-center gap-2'>
          <div className='text-muted-foreground'>
            <Dollar />
          </div>
          <span className='text-white text-5xl font-bold tracking-tight tabular-nums'>
            {satPriceToShow ? Number(formatSatPrice(satPriceToShow)).toLocaleString('es-ES') : '—'}
          </span>
        </div>
        <span className='text-neutral-400 text-lg font-medium'>{price?.currency || 'MXN'}</span>
      </div>

      <div className='flex items-center gap-3 mt-1.5'>
        {priceChange !== null ? (
          <span className={`text-xs font-medium ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChange >= 0 ? '+' : ''}
            {Number(priceChange.toFixed(2)).toLocaleString('es-ES')}%
          </span>
        ) : (
          <span className='text-xs font-medium text-neutral-500'>Cargando...</span>
        )}
        <span className='text-muted-foreground text-xs'>|</span>
        <span className='text-muted-foreground text-xs'>{timeframeText}</span>
      </div>
    </div>
  );
}
