'use client';

import { useState } from 'react';

import { Check, X } from 'lucide-react';

import type { PaymentStep } from '@/types';
import { Button } from '@/components/ui/button';
import { QRCodeDisplay } from './qr-code-display';
import { DialogBody, DialogClose, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

interface StepGenerateQRProps {
  invoice: string;
  step: PaymentStep;
  error: string | null;
}

export function StepGenerateQR({ invoice, step, error = null }: StepGenerateQRProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(invoice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <DialogHeader className='flex-row items-center justify-between'>
        <DialogTitle className='text-base font-semibold text-white'>Scan and Pay</DialogTitle>
        <DialogClose asChild>
          <Button variant='secondary' size='icon'>
            <X />
          </Button>
        </DialogClose>
      </DialogHeader>

      {!error && (
        <>
          <DialogBody className='gap-4'>
            <QRCodeDisplay value={invoice} />
            <div className='inline-flex items-center gap-2 px-4 text-sm text-muted-foreground'>
              {invoice ? (
                <>
                  <div className='size-2 bg-blue-500 rounded-full animate-pulse' />
                  <p>Waiting Payment...</p>
                </>
              ) : (
                <>
                  <div className='size-2 bg-orange-500 rounded-full animate-pulse' />
                  <p>Generating Invoice...</p>
                </>
              )}
            </div>
          </DialogBody>

          <DialogFooter>
            <Button className='w-full' variant='outline' onClick={handleCopy} disabled={!!copied || !invoice}>
              {copied ? <Check className='size-4' /> : <>Copy Invoice</>}
            </Button>
          </DialogFooter>
        </>
      )}
    </>
  );
}
