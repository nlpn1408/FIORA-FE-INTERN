'use client';

import dynamic from 'next/dynamic';
import { Loading } from '@/components/common/atoms';

const CreateInvoicePage = dynamic(
  () => import('@/features/invoices/presentation/CreateInvoicePage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);
export default function RequestInvoice() {
  return <CreateInvoicePage />;
}
