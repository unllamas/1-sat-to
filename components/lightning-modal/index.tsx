'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

import { useLightning } from '@/hooks/use-lightning';

import { Button } from '@/components/ui/button';
import { StepSelectOption } from '@/components/lightning-modal/step-select-option';
import { StepConfirmPayment } from '@/components/lightning-modal/step-confirm-payment';
import { StepGenerateQR } from '@/components/lightning-modal/step-generate-qr';

import type { LightningPlan, PaymentStep } from '@/types';
import { Dialog, DialogBody, DialogContent, DialogFooter } from '../ui/dialog';
import { plans } from '@/config/plans';

interface LightningPayModalProps {
  lightningAddress?: string;
  onSuccess?: (data: { planId: string; invoice: string; preimage?: string }) => void;
  onClose?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
}

export function LightningPayModal({
  lightningAddress = '',
  onSuccess,
  onClose,
  open,
  onOpenChange,
  currency,
}: LightningPayModalProps) {
  const [step, setStep] = useState<PaymentStep>('select');
  const [selectedPlan, setSelectedPlan] = useState<LightningPlan | null>(null);

  const { invoice, createInvoice, status, error, clearInvoice } = useLightning(lightningAddress);

  const handleSelectPlan = (plan: LightningPlan) => {
    setSelectedPlan(plan);
    setStep('confirm');
  };

  const handleBack = () => {
    setSelectedPlan(null);
    setStep('select');
  };

  const handleConfirm = (currentCurrency: string) => {
    setStep('pending');
    createInvoice(Number(selectedPlan?.price), currentCurrency);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        clearInvoice();
        setStep('select');
        onOpenChange(false);
      }}
    >
      <DialogContent className='gap-0 max-w-sm p-0' showCloseButton={false}>
        {/* Content */}

        {step === 'select' && <StepSelectOption key='select' plans={plans} onSelectPlan={handleSelectPlan} />}

        {step === 'confirm' && selectedPlan && (
          <StepConfirmPayment
            key='confirm'
            currency={currency}
            plan={selectedPlan}
            onConfirm={handleConfirm}
            onBack={handleBack}
          />
        )}

        {step === 'pending' && status !== 'paid' && (
          <StepGenerateQR key='qr' invoice={invoice || ''} step={step} error={error} />
        )}

        {error && (
          <div className='p-4 bg-red-500/10 text-center'>
            <p className='text-sm text-red-400'>{error}</p>
          </div>
        )}

        {status === 'paid' && (
          <>
            <DialogBody>
              <div className='text-center space-y-4'>
                <div className='w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center'>
                  <Check className='size-10 text-green-400' />
                </div>
                <div className='space-y-2'>
                  <h2 className='text-2xl font-bold text-foreground'>Confirmed!</h2>
                  <p className='text-muted-foreground'>Your payment has been received successfully.</p>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                className='w-full'
                variant='secondary'
                onClick={() => {
                  clearInvoice();
                  setStep('select');
                  onOpenChange(false);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
