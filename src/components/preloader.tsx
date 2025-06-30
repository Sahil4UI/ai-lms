
'use client';

import { Icons } from './icons';

export function Preloader() {
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
    >
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="absolute h-full w-full animate-[spin_4s_linear_infinite] rounded-full border-2 border-dashed border-primary/50"></div>
        <div className="absolute h-[85%] w-[85%] animate-[spin_4s_linear_infinite_reverse] rounded-full border-2 border-dashed border-accent/50"></div>
        <Icons.logo className="h-16 w-16 text-primary animate-pulse" />
      </div>
       <p className="mt-4 text-sm text-muted-foreground">Building the future of learning...</p>
    </div>
  );
}
