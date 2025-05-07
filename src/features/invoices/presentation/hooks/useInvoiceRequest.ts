import { useState } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

interface UseInvoiceRequestOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  endpoint?: string;
}

interface InvoiceRequestResult {
  isSubmitting: boolean;
  isSuccess: boolean;
  handleSubmit: (data: any) => Promise<void>;
}

export function useInvoiceRequest<T extends FieldValues>({
  form,
  endpoint = '/api/invoices/request',
}: UseInvoiceRequestOptions<T>): InvoiceRequestResult {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: T) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific errors with appropriate messages
        if (response.status === 404) {
          toast.error(`Order not found: ${result.message}`, {
            description: 'Please check your order number and try again.',
          });
        } else if (result.errors) {
          // Handle field validation errors
          const errorMessage = Object.values(result.errors).join(', ');
          toast.error(`Validation errors: ${errorMessage}`);
        } else {
          // Generic error message
          const errorMessage = result.message || `HTTP error! status: ${response.status}`;
          toast.error(`Failed to submit request: ${errorMessage}`);
        }
        console.error('API Error:', result);
      } else {
        setIsSuccess(true);

        if (result.validation) {
          if (result.validation.status === 'warning') {
            // Show warning toast but still indicate success with form reset
            toast.warning(`Invoice request requires review`, {
              description: `Request No: ${result.data?.reqNo}. Your invoice request has been submitted but requires manual review.`,
            });
          } else {
            toast.success(`Invoice request submitted successfully!`, {
              description: `Request No: ${result.data?.reqNo}. You will receive a confirmation email soon.`,
            });
          }
        } else {
          // Fallback to standard success message if no validation info
          toast.success(`Invoice request submitted successfully!`, {
            description: `Request No: ${result.data?.reqNo}. You will receive a confirmation email soon.`,
          });
        }

        form.reset(); // Reset form on success

        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error: ', error.stack);
      }
      console.error('Submission Error:', error);
      toast.error('An unexpected error occurred while submitting the request.');
    }
  };

  return {
    isSubmitting: form.formState.isSubmitting,
    isSuccess,
    handleSubmit,
  };
}
