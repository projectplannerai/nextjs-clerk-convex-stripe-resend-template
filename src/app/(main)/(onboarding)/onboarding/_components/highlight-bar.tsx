'use client';

import React from 'react';

import { useOnboardingContextHook } from '@/context/use-onboarding-context';
import { cn } from '@/lib/utils';

type Props = {};

export default function HighlightBar(props: Props) {
  const { currentStep } = useOnboardingContextHook();

  return (
    <div className="grid grid-cols-3 gap-3">
      <div
        className={cn(
          'rounded-full h-2 col-span-1',
          currentStep == 1 ? 'bg-orange' : 'bg-platinum',
        )}
      ></div>
      <div
        className={cn(
          'rounded-full h-2 col-span-1',
          currentStep == 2 ? 'bg-orange' : 'bg-platinum',
        )}
      ></div>
      <div
        className={cn(
          'rounded-full h-2 col-span-1',
          currentStep == 3 ? 'bg-orange' : 'bg-platinum',
        )}
      ></div>
    </div>
  );
}
