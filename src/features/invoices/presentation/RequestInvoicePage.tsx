'use client';

import Header from '@/features/landing/presentation/components/Header';
import RequestInvoiceForm from './organisms/RequestInvoiceForm';
import Footer from '@/features/landing/presentation/components/Footer';

const RequestInvoicePage = () => {
  return (
    <>
      <Header />
      <div className="mt-20 p-10">
        <RequestInvoiceForm />
      </div>
      <Footer />
    </>
  );
};

export default RequestInvoicePage;
