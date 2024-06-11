'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Must enter name.',
  }),
});

export const useOnboardingForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });

  const onHandleSubmit = methods.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      try {
        // Handle the form submission with validated values here
        console.log(values);
        // Example navigation
        // router.push('/success');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  );

  return {
    methods,
    onHandleSubmit,
    loading,
  };
};
