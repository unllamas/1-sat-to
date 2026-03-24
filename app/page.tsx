'use client';

import Link from 'next/link';

import { SUPPORTED_CURRENCIES } from '@/lib/types';

import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='flex flex-col gap-8 w-full max-w-2xl mx-auto px-4'>
        <h1 className='text-center text-foreground text-5xl font-bold tracking-tight tabular-nums'>1 SAT a...</h1>
        <div className='flex flex-wrap justify-center gap-2'>
          {SUPPORTED_CURRENCIES?.map((currency) => (
            <Button key={currency?.code} className='gap-1' variant='secondary' asChild>
              <Link href={`/${currency?.code}`}>
                <span className='mr-2'>{currency.flag}</span>
                <span className='flex-1'>{currency.name}</span>
                {/* <span className='text-muted-foreground text-xs'>{currency.code}</span> */}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
