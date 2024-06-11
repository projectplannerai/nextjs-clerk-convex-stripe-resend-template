'use client';

import React from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useOnboardingContextHook } from '@/context/use-onboarding-context';
import { useFormContext } from 'react-hook-form';

type Props = {};

const ButtonHandler = (props: Props) => {
  const { setCurrentStep, currentStep } = useOnboardingContextHook();
  const { formState, getFieldState, getValues } = useFormContext();

  const { isDirty: isName } = getFieldState('fullname', formState);
  const { isDirty: isEmail } = getFieldState('email', formState);
  const { isDirty: isPassword } = getFieldState('password', formState);

  if (currentStep === 3) {
    return (
      <div className="w-full flex flex-col gap-3 items-center">
        <Button type="submit" className="w-full">
          Create an account
        </Button>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="w-full flex flex-col gap-3 items-center">
        <Button
          type="submit"
          className="w-full"
          onClick={() => setCurrentStep((prev: number) => prev + 1)}
        >
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <Button
        type="submit"
        className="w-full"
        onClick={() => setCurrentStep((prev: number) => prev + 1)}
      >
        Continue
      </Button>
    </div>
  );
};

export default ButtonHandler;
