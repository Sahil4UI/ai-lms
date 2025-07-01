
import type { Metadata } from 'next';
import TermsOfServiceClientPage from './terms-client-page';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClientPage />;
}
