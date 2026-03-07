'use client';

import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SUPPORTED_CURRENCIES, Currency } from '@/lib/types';

interface CurrencySelectorProps {
  currentCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export function CurrencySelector({ currentCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const current = SUPPORTED_CURRENCIES.find((c) => c.code === currentCurrency) || SUPPORTED_CURRENCIES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary'>
          {current.flag} {current.code}
          <ChevronDown className='w-4 h-4 text-muted-foreground' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {SUPPORTED_CURRENCIES.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => onCurrencyChange(currency.code)}
            className={`cursor-pointer focus:bg-neutral-800 focus:text-white ${
              currency.code === currentCurrency ? 'bg-orange-500/10 text-orange-400' : ''
            }`}
          >
            <span className='mr-2'>{currency.flag}</span>
            <span className='flex-1'>{currency.name}</span>
            <span className='text-muted-foreground text-xs'>{currency.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
