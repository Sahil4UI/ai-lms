
'use client';

import { useState, useEffect } from 'react';

export default function TermsOfServiceClientPage() {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

  return (
    <div className="bg-background">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl prose prose-lg dark:prose-invert">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {currentDate || '...'}
            </p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services. This is a placeholder document.
            </p>
            
            <h2>2. User Accounts</h2>
            <p>
              You must provide accurate and complete information when creating an account. You are responsible for safeguarding your account and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>

            <h2>3. Courses and Content</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to access and view the courses and associated content for which you have paid all required fees, solely for your personal, non-commercial, educational purposes through the Services, in accordance with these Terms.
            </p>
            
            <h2>4. Payments</h2>
            <p>
              You agree to pay the fees for courses that you purchase, and you authorize us to charge your debit or credit card or process other means of payment for those fees.
            </p>
            
             <h2>5. Limitation of Liability</h2>
            <p>
                In no event shall LearnAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@learnai.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
