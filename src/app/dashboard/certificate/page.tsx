'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Certificate } from '@/components/certificate';
import { Loader2, Printer } from 'lucide-react';
import Link from 'next/link';

function CertificateDisplay() {
  const searchParams = useSearchParams();
  const courseTitle = searchParams.get('course') || 'Your Amazing Course';
  const studentName = 'Valued Student'; // In a real app, this would come from useAuth()

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <Certificate studentName={studentName} courseTitle={courseTitle} />
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 no-print">
        <Button onClick={handlePrint} size="lg">
          <Printer className="mr-2 h-5 w-5" />
          Print or Save as PDF
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-print-area,
          .certificate-print-area * {
            visibility: visible;
          }
          .certificate-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
          .no-print {
            display: none;
          }
        }
        @page {
          size: landscape;
          margin: 0;
        }
      `}</style>
    </div>
  );
}


export default function CertificatePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <CertificateDisplay />
        </Suspense>
    )
}
