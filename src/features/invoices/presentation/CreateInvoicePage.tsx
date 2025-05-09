'use client';

import Header from '@/features/landing/presentation/components/Header';
import CreateInvoiceForm from './organisms/CreateInvoiceForm';
import Footer from '@/features/landing/presentation/components/Footer';

const RequestInvoicePage = () => {
  return (
    <>
      <Header />
      <div className="mt-20 p-10">
        <CreateInvoiceForm />
      </div>
      <Footer />
    </>
  );
};

export default RequestInvoicePage;
