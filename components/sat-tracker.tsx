'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useSatTracker } from '@/hooks/use-sat-tracker';

import { DEFAULT_CURRENCY } from '@/lib/types';

import { PriceDisplay } from '@/components/price-display';
import { PriceChart } from '@/components/price-chart';
import { TimeframeSelector } from '@/components/timeframe-selector';
import { CalculatorModal } from '@/components/calculator-modal';
import { ThemeModal } from '@/components/theme-modal';
import { CurrencySelector } from '@/components/currency-selector';
import { NavDock } from '@/components/nav-dock';
import { SatoshiInfoModal } from '@/components/satoshi-info-modal';
import { LightningPayModal } from './lightning-modal';

interface SatTrackerProps {
  initialCurrency?: string;
}

export function SatTracker({ initialCurrency = DEFAULT_CURRENCY }: SatTrackerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currency = searchParams.get('currency') || initialCurrency;

  const { price, historicalData, timeframe, timeframeLabel, isLoading, priceChange, changeTimeframe } = useSatTracker({
    currency,
  });

  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [satoshiInfoOpen, setSatoshiInfoOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

  const handleCurrencyChange = (newCurrency: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCurrency === DEFAULT_CURRENCY) {
      params.delete('currency');
    } else {
      params.set('currency', newCurrency);
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const handleSuccess = (data: { planId: string; invoice: string }) => {
    console.log('✅ Payment successful!', data);
    // Handle successful payment (e.g., update user credits, show confirmation)
  };

  return (
    <div className='relative w-full h-screen flex flex-col overflow-hidden'>
      {/* Header with currency selector */}
      {/* <div className='absolute top-4 right-4 z-20'>
        <CurrencySelector currentCurrency={currency} onCurrencyChange={handleCurrencyChange} />
      </div> */}

      {/* Main content */}
      <div className='relative flex flex-col pt-24 flex-1'>
        <PriceDisplay price={price} priceChange={priceChange} timeframeLabel={timeframeLabel} />

        <TimeframeSelector current={timeframe} onChange={changeTimeframe} />
      </div>

      {/* Chart */}
      <PriceChart data={historicalData} isLoading={isLoading} />

      {/* Navigation dock */}
      <NavDock
        onCalculatorClick={() => setCalculatorOpen(true)}
        onThemeClick={() => setThemeOpen(true)}
        onInfoClick={() => setSatoshiInfoOpen(true)}
        onDonationClick={() => setDonationOpen(true)}
      />

      {/* Modals */}
      <CalculatorModal open={calculatorOpen} onOpenChange={setCalculatorOpen} price={price} />

      <ThemeModal open={themeOpen} onOpenChange={setThemeOpen} />

      <SatoshiInfoModal open={satoshiInfoOpen} onOpenChange={setSatoshiInfoOpen} />

      <LightningPayModal
        lightningAddress={'unllamas@blink.sv'}
        onSuccess={handleSuccess}
        open={donationOpen}
        onOpenChange={setDonationOpen}
        currency={currency}
      />
    </div>
  );
}
