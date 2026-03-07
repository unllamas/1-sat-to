'use client';

import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from './ui/card';

interface SatoshiInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SatoshiInfoModal({ open, onOpenChange }: SatoshiInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm' showCloseButton={false}>
        <DialogHeader className='flex-row items-center justify-between'>
          <DialogTitle className='text-base font-semibold text-white'>Que es un Satoshi?</DialogTitle>
          <DialogClose asChild>
            <Button variant='secondary' size='icon'>
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className='space-y-4 pb-4'>
          <p className='text-foreground leading-relaxed'>
            Un <span className='text-white font-semibold'>Satoshi</span> (o SAT) es la unidad mas pequena de Bitcoin.
            Lleva el nombre de <span className='text-white font-medium'>Satoshi Nakamoto</span>, el creador anonimo de
            Bitcoin.
          </p>

          <Card className=''>
            <CardContent className='text-center'>
              <span className='text-white text-lg'>100,000,000 SATs</span>
              <p className='text-muted-foreground text-md'>= 1 Bitcoin</p>
            </CardContent>
          </Card>

          <p className='text-foreground leading-relaxed'>
            Al igual que un peso se divide en centavos, Bitcoin se divide en Satoshis. Esto permite realizar
            microtransacciones y facilita el uso diario de la red.
          </p>

          {/* <p className='text-muted-foreground font-medium text-sm uppercase'>Por que usar Satoshis?</p>
          <ul className='space-y-2'>
            <li className='flex items-center gap-2'>
              <span className='text-orange-500'>•</span>
              <span className='text-foreground text-sm'>
                Es mas facil decir <span className='text-white font-medium'>&quot;1,000 SATs&quot;</span> que
                &quot;0.00001 BTC&quot;
              </span>
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-orange-500'>•</span>
              <span className='text-foreground text-sm'>Permite expresar cantidades pequenas de forma intuitiva</span>
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-orange-500'>•</span>
              <span className='text-foreground text-sm'>
                Es la unidad estandar en la <span className='text-white font-medium'>Lightning Network</span>
              </span>
            </li>
          </ul> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
