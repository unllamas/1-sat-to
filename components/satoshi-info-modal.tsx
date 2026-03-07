'use client';

import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

        <DialogBody>
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
        </DialogBody>
        <DialogFooter>
          <p className='text-muted-foreground leading-relaxed text-center text-xs'>
            Al igual que un peso se divide en centavos, Bitcoin se divide en Satoshis. Esto permite realizar
            microtransacciones y facilita el uso diario de la red.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
