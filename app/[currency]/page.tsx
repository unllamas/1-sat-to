import { Suspense } from 'react';

import { SatTracker } from '@/components/sat-tracker';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-neutral-950'>
          <div className='w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin' />
        </div>
      }
    >
      <SatTracker />
    </Suspense>
  );
}
