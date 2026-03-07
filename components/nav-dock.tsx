'use client';

import { Calculator, Info, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavDockProps {
  onCalculatorClick: () => void;
  onThemeClick: () => void;
  onInfoClick: () => void;
}

export function NavDock({ onCalculatorClick, onThemeClick, onInfoClick }: NavDockProps) {
  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-5 px-4'>
      <div className='bg-neutral-900/80 backdrop-blur-xl border border-white/6 rounded-full p-1.5 flex gap-1 shadow-2xl shadow-black/50'>
        <Button variant='ghost' size='icon' onClick={onCalculatorClick}>
          <Calculator className='w-4 h-4' />
        </Button>
        {/* <Button variant='ghost' size='icon' onClick={onThemeClick}>
          <Palette className='w-4 h-4' />
        </Button> */}
        <Button variant='ghost' size='icon' onClick={onInfoClick}>
          <Info className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
}
