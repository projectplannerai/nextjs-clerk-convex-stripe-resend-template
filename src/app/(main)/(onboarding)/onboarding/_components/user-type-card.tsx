'use client';

import React from 'react';

import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { UserTypeCardProps } from '@/types/types';
import { User } from 'lucide-react';

export function UserTypeCard({
  register,
  setUserType,
  text,
  title,
  userType,
  value,
}: UserTypeCardProps) {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          'w-full cursor-pointer',
          userType == value && 'border-orange-500',
        )}
      >
        <CardContent className="flex justify-between p-2">
          <div className="flex items-center gap-3">
            <Card
              className={cn(
                'flex justify-center p-3',
                userType == value && 'border-orange-500',
              )}
            >
              <User
                size={30}
                className={cn(
                  userType == value ? 'text-orange-500' : 'text-gray-400',
                )}
              />
            </Card>
            <div className="">
              <CardDescription className="text-iridium">
                {title}
              </CardDescription>
              <CardDescription className="text-gray-400">
                {text}
              </CardDescription>
            </div>
          </div>
          <div>
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                userType == value ? 'bg-orange-500' : 'bg-transparent',
              )}
            >
              <Input
                {...register('type', {
                  onChange: (event) => setUserType(event.target.value),
                })}
                value={value}
                id={value}
                className="hidden"
                type="radio"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Label>
  );
}
