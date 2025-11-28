'use client'

import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

function Icon() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-6 w-6" />;
  }

  return <BrainCircuit className="h-6 w-6 text-primary" />;
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon />
      <span className="text-lg font-semibold text-primary">Quiz Solver AI</span>
    </div>
  );
}
