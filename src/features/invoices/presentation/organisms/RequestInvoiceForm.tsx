'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Phone validation regex for format 0xxx xxx xxx
const PHONE_REGEX = /^0\d{3}(\s\d{3}){2}$/;

interface Provider {
  id: string;
  name: string;
}

const requestInvoiceSchema = Yup.object().shape({
  orderNo: Yup.string().required('Order number is required.'),
  customerName: Yup.string().required('Customer name is required.'),
  taxNo: Yup.string().optional(),
  taxAddress: Yup.string().optional(),
  email: Yup.string().email('Invalid email address.').required('Email address is required.'),
  providerId: Yup.string().required('Provider is required.'),
  phone: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .test(
      'is-valid-phone',
      'Phone number should be in format: 0xxx xxx xxx',
      (value) => !value || PHONE_REGEX.test(value),
    ),
});

type RequestInvoiceFormValues = Yup.InferType<typeof requestInvoiceSchema>;

const RequestInvoiceForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  const form = useForm({
    resolver: yupResolver(requestInvoiceSchema),
    mode: 'onChange',
    defaultValues: {
      orderNo: '',
      customerName: '',
      taxNo: '',
      taxAddress: '',
      email: '',
      phone: '',
      providerId: '',
    },
  });

  // Fetch providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      // setIsLoadingProviders(true);
      // try {
      //   const response = await fetch('/api/providers');
      //   if (!response.ok) {
      //     throw new Error('Failed to fetch providers');
      //   }
      //   const data = await response.json();
      //   setProviders(data.providers || []);
      // } catch (error) {
      //   console.error('Error fetching providers:', error);
      //   toast.error('Failed to load providers');
      // } finally {
      //   setIsLoadingProviders(false);
      // }
      setProviders([
        { id: 'seed-user-1', name: 'Provider 1' },
        { id: 'seed-user-2', name: 'Provider 2' },
        { id: 'seed-user-3', name: 'Provider 3' },
        { id: 'seed-user-4', name: 'Provider 4' },
      ]);
      setIsLoadingProviders(false);
    };

    fetchProviders();
  }, []);

  // Format phone number as user types (0xxx xxx xxx)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format to 0xxx xxx xxx
    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.substring(0, 4)} ${digits.substring(4)}`;
    } else {
      return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7, 10)}`;
    }
  };

  async function onSubmit(data: RequestInvoiceFormValues) {
    try {
      const response = await fetch('/api/invoices/request', {
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
        } else if (response.status === 403) {
          toast.error(`Access denied: ${result.message}`, {
            description: 'Please verify your email or phone number matches order details.',
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
          } else if (result.validation.status === 'success') {
            toast.success(result.validation.message, {
              description: `Request No: ${result.data?.reqNo}. You will receive a confirmation email soon.`,
            });
          } else {
            // Fallback to standard success message
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
  }

  const isSubmitting = form.formState.isSubmitting;
  const isFormValid = form.formState.isValid;

  return (
    <Card className={`max-w-3xl mx-auto shadow-sm ${className || ''}`} {...props}>
      <CardHeader className="text-center">
        <CardTitle>Request Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First row */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax code" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Second row */}
              <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingProviders ? 'Loading providers...' : 'Select provider'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order code*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter order code" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Third row */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0xxx xxx xxx"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const formattedValue = formatPhoneNumber(e.target.value);
                          onChange(formattedValue);
                        }}
                        maxLength={12} // 0xxx xxx xxx (10 digits + 2 spaces)
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address field (full width) */}
            <FormField
              control={form.control}
              name="taxAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your address"
                      className="resize-none"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isSuccess || !isFormValid}
                className="w-40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    <span>Submitted</span>
                  </>
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RequestInvoiceForm;
