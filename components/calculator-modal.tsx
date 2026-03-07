'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Calculator, ArrowUpDown, X } from 'lucide-react';
import { BitcoinIcon } from '@bitcoin-design/bitcoin-icons-react/filled';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BtcDigits } from '@/components/btc-digits';
import { PriceData, Currency, SUPPORTED_CURRENCIES } from '@/lib/types';

interface CalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  price: PriceData | null;
}

function formatFiat(value: number, locale: string = 'es-MX'): string {
  return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CalculatorModal({ open, onOpenChange, price }: CalculatorModalProps) {
  const [satsOnTop, setSatsOnTop] = useState(true);
  const [satsValue, setSatsValue] = useState('');
  const [fiatValue, setFiatValue] = useState('');
  const satsInputRef = useRef<HTMLInputElement>(null);
  const fiatInputRef = useRef<HTMLInputElement>(null);

  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === price?.currency) || SUPPORTED_CURRENCIES[0];
  const satPrice = price?.satPrice || 0;
  const satsPerUnit = price?.satsPerUnit || 0;

  // Calculate conversions
  const satsNum = parseFloat(satsValue) || 0;
  const fiatNum = parseFloat(fiatValue) || 0;

  const fiatResult = satsOnTop ? satsNum * satPrice : fiatNum;
  const satsResult = satsOnTop ? satsNum : Math.round(fiatNum * satsPerUnit);

  const handleSwitch = useCallback(() => {
    setSatsOnTop((prev) => !prev);
    setSatsValue('');
    setFiatValue('');
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (satsOnTop) {
          satsInputRef.current?.focus();
        } else {
          fiatInputRef.current?.focus();
        }
      }, 100);
    }
  }, [open, satsOnTop]);

  const formatSatPrice = (p: number): string => {
    if (p >= 0.01) return p.toFixed(4);
    return p.toFixed(6);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className='flex-row items-center justify-between space-y-0 mb-5'>
          <DialogTitle className='text-base font-semibold text-white'>Calculadora</DialogTitle>
          <DialogClose asChild>
            <Button variant='ghost' size='icon'>
              <X className='w-4 h-4' />
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* Top input area */}
        <div className=''>
          <label className='block text-neutral-500 text-[11px] font-medium mb-2 uppercase tracking-wider'>
            {satsOnTop ? 'Satoshis (SATs)' : `${currency.name} (${currency.code})`}
          </label>

          {satsOnTop ? (
            <div
              className='bg-neutral-800 border-2 border-orange-500 rounded-xl p-4 flex items-center gap-3 min-h-18 cursor-text'
              onClick={() => satsInputRef.current?.focus()}
            >
              <span className='text-orange-500 text-2xl font-bold shrink-0'>B</span>
              <input
                ref={satsInputRef}
                type='number'
                value={satsValue}
                onChange={(e) => setSatsValue(e.target.value)}
                className='absolute opacity-0 w-0 h-0'
                min='0'
              />
              <BtcDigits sats={satsNum} isActive />
            </div>
          ) : (
            <div className='bg-neutral-800 border-2 border-orange-500 rounded-xl p-4 flex items-center gap-3 min-h-18'>
              <span className='text-orange-500 text-xl font-semibold'>{currency.symbol}</span>
              <input
                ref={fiatInputRef}
                type='number'
                value={fiatValue}
                onChange={(e) => setFiatValue(e.target.value)}
                placeholder='0'
                min='0'
                className='bg-transparent border-none outline-none text-white text-[28px] font-bold tabular-nums w-full caret-orange-500 placeholder:text-neutral-700'
              />
            </div>
          )}
        </div>

        {/* Switch button */}
        <div className='relative z-10 flex justify-center'>
          <Button variant='secondary' size='icon' onClick={handleSwitch}>
            <ArrowUpDown className='w-4 h-4' />
          </Button>
        </div>

        {/* Bottom output area */}
        <div className=''>
          {/* <label className='block text-neutral-500 text-[11px] font-medium mb-2 uppercase tracking-wider'>
            {satsOnTop ? `${currency.name} (${currency.code})` : 'Satoshis (SATs)'}
          </label> */}

          {satsOnTop ? (
            <div className='bg-neutral-950 border border-white/6 rounded-xl p-4 flex items-center gap-3 min-h-18'>
              <span className='text-neutral-600 text-xl font-semibold'>{currency.symbol}</span>
              <span
                className={`text-[28px] font-bold tabular-nums ${fiatResult > 0 ? 'text-neutral-300' : 'text-neutral-700'}`}
              >
                {fiatResult > 0 ? `$${formatFiat(fiatResult)}` : '0.00'}
              </span>
            </div>
          ) : (
            <div className='flex flex-col justify-center min-h-20 px-4 bg-input border border-white/6 rounded-xl'>
              <div className='flex justify-between w-full text-sm'>
                <p>Bitcoin</p>
                <p className='text-muted-foreground'>(BTC)</p>
              </div>
              {/* <span className='text-neutral-600 text-xl font-bold'>B</span> */}
              <BtcDigits sats={satsResult} isActive={satsResult > 0} />
            </div>
          )}
        </div>

        {/* Rate display */}
        <div className='bg-neutral-800/50 rounded-xl p-3 border border-white/4'>
          <div className='flex justify-between items-center'>
            <span className='text-neutral-500 text-[11px]'>Tasa actual</span>
            <span className='text-orange-400 text-xs font-semibold'>
              1 SAT = {currency.symbol}
              {formatSatPrice(satPrice)} {currency.code}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
