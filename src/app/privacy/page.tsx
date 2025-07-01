
import type { Metadata } from 'next';
import PrivacyPolicyClientPage from './privacy-client-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientPage />;
}
