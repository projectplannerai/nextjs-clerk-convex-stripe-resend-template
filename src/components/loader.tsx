import React from 'react';

import { cn } from '@/lib/utils';
import { LoaderProps } from '@/types/types';
import { Loader2 } from 'lucide-react';

export function Loader({
  loading,
  children,
  noPadding,
  className,
}: LoaderProps) {
  return loading ? (
    <div className={cn(className || 'w-full py-5 flex justify-center')}>
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  ) : (
    children
  );
}
