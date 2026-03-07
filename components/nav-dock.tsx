'use client';

import { ArrowUpRight, Calculator, Gift, Heart, Info, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from './ui/separator';
import Link from 'next/link';

interface NavDockProps {
  onCalculatorClick: () => void;
  onThemeClick: () => void;
  onInfoClick: () => void;
  onDonationClick: () => void;
}

export function NavDock({ onCalculatorClick, onThemeClick, onInfoClick, onDonationClick }: NavDockProps) {
  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center gap-1 pb-8 px-4'>
      <div className='relative z-0 flex items-center gap-2 p-2 bg-background backdrop-blur-xl border border-white/6 rounded-full shadow-2xl shadow-black'>
        <Button variant='ghost' size='icon-lg' onClick={onInfoClick}>
          <Info />
        </Button>
        <Button variant='ghost' size='icon-lg' onClick={onCalculatorClick}>
          <Calculator />
        </Button>
        <Button variant='ghost' size='icon-lg' onClick={onDonationClick}>
          <Gift />
        </Button>
        {/* <Button variant='ghost' size='icon-lg' onClick={onThemeClick}>
          <Palette className='w-4 h-4' />
        </Button> */}
      </div>
      <div className='relative z-10'>
        <span className='text-sm text-muted-foreground'>by</span>
        <Button variant='link' asChild>
          <Link href='https://www.jonallamas.com/' target='_blank'>
            @unllamas <ArrowUpRight className='text-muted-foreground' />
          </Link>
        </Button>
      </div>
    </div>
  );
}
