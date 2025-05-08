'use client';

import dynamic from 'next/dynamic';
import { Loading } from '@/components/common/atoms';

const RequestInvoicePage = dynamic(
  () => import('@/features/invoices/presentation/RequestInvoicePage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);
export default function RequestInvoice() {
  return <RequestInvoicePage />;
}
