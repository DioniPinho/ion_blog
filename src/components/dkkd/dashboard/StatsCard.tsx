'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  change,
  className,
  iconClassName
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {change && (
              <p className="text-xs mt-1">
                <span className={cn(
                  "inline-flex items-center",
                  change.positive ? "text-green-500" : "text-red-500"
                )}>
                  {change.positive ? '↑' : '↓'} {change.value}
                </span>
                <span className="text-muted-foreground ml-1">em relação ao mês passado</span>
              </p>
            )}
          </div>
          <div className={cn(
            "flex items-center justify-center rounded-full p-2 bg-primary/10",
            iconClassName
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}