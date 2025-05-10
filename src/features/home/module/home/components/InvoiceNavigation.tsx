import { useRouter } from 'next/router';

interface InvoiceNavigationProps {
  nextInvoiceId: string | null;
  prevInvoiceId: string | null;
}

export default function InvoiceNavigation({
  nextInvoiceId,
  prevInvoiceId,
}: InvoiceNavigationProps) {
  const router = useRouter();

  const handleNext = () => {
    if (nextInvoiceId) {
      router.push(`/invoice/${nextInvoiceId}`);
    }
  };

  const handlePrevious = () => {
    if (prevInvoiceId) {
      router.push(`/invoice/${prevInvoiceId}`);
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handlePrevious}
        disabled={!prevInvoiceId}
        className="px-4 py-2 bg-gray-300 text-white rounded disabled:bg-gray-400"
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        disabled={!nextInvoiceId}
        className="px-4 py-2 bg-gray-300 text-white rounded disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
}
