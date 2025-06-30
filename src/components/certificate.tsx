'use client';

import { useState, useEffect } from 'react';
import { Icons } from './icons';

type CertificateProps = {
  studentName: string;
  courseTitle: string;
};

export function Certificate({ studentName, courseTitle }: CertificateProps) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  return (
    <div className="certificate-print-area bg-background text-foreground border-4 border-primary p-8 rounded-lg shadow-2xl w-full aspect-[1.414/1] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom_1px_center"></div>
      <div className="absolute -top-20 -left-20">
         <Icons.logo className="h-48 w-48 text-primary/10" />
      </div>
       <div className="absolute -bottom-20 -right-20 transform rotate-180">
         <Icons.logo className="h-48 w-48 text-primary/10" />
      </div>
      <div className="text-center relative z-10">
        <h2 className="text-2xl font-bold text-muted-foreground uppercase tracking-widest">
          Certificate of Completion
        </h2>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary my-4">
          {courseTitle}
        </h1>
        <p className="text-lg text-muted-foreground mt-8">
          This certificate is proudly presented to
        </p>
        <p className="font-headline text-4xl font-semibold my-4">
          {studentName}
        </p>
        <p className="text-lg text-muted-foreground">
          for successfully completing the course on {currentDate}.
        </p>
        <div className="mt-12 flex justify-between items-end w-full max-w-md mx-auto">
            <div className="text-center">
                <p className="font-signature text-4xl">Sahil</p>
                <div className="border-t-2 w-full mt-1 border-muted-foreground"></div>
                <p className="text-sm text-muted-foreground">Lead Instructor</p>
            </div>
            <div className="flex flex-col items-center">
                <Icons.logo className="h-20 w-20 text-primary" />
                <p className="text-xs font-bold text-primary mt-1">LearnAI</p>
            </div>
        </div>
      </div>
    </div>
  );
}
