'use client';

import { Calculator, Info, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from './ui/separator';
import Link from 'next/link';

interface NavDockProps {
  onCalculatorClick: () => void;
  onThemeClick: () => void;
  onInfoClick: () => void;
}

export function NavDock({ onCalculatorClick, onThemeClick, onInfoClick }: NavDockProps) {
  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 px-4'>
      <div className='flex items-center gap-2 p-2 bg-background backdrop-blur-xl border border-white/6 rounded-full shadow-2xl shadow-black/50'>
        <Button variant='ghost' size='icon-lg' onClick={onCalculatorClick}>
          <Calculator />
        </Button>
        {/* <Button variant='ghost' size='icon-lg' onClick={onThemeClick}>
          <Palette className='w-4 h-4' />
        </Button> */}
        <Button variant='ghost' size='icon-lg' onClick={onInfoClick}>
          <Info />
        </Button>
        <Separator orientation='vertical' />
        <div className='px-2'>
          <p>
            <span className='text-sm text-muted-foreground'>by</span>{' '}
            <Button className='px-1' variant='link' asChild>
              <Link href='https://www.jonallamas.com/' target='_blank'>
                @unllamas
              </Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
