import { Metadata } from 'next';
import SubscriptionsClientPage from './subscriptions-client-page';

export const metadata: Metadata = {
  title: 'Newsletter Subscriptions - Admin Panel',
  description: 'Manage newsletter subscriptions',
};

export default function SubscriptionsPage() {
  return <SubscriptionsClientPage />;
}
