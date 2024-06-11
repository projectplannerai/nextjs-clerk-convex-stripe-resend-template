'use client';

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type InitialValuesProps = {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

const InitialValues: InitialValuesProps = {
  currentStep: 1,
  setCurrentStep: () => undefined,
};

const onnboardingContext = createContext(InitialValues);

const { Provider } = onnboardingContext;

export const OnboardingContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState<number>(
    InitialValues.currentStep,
  );
  const values = {
    currentStep,
    setCurrentStep,
  };
  return <Provider value={values}>{children}</Provider>;
};

export const useOnboardingContextHook = () => {
  const state = useContext(onnboardingContext);
  return state;
};
