/**
 * Data Transfer Object for invoice request inputs
 */
export interface InvoiceRequestDto {
  orderNo: string;
  customerName: string;
  email: string;
  providerId: string;
  taxNo?: string | null;
  taxAddress?: string | null;
  phone?: string | null;
}

/**
 * Data Transfer Object for invoice request results
 */
export interface InvoiceRequestResultDto {
  invoiceId: string;
  reqNo: string;
  orderId: string;
  validationStatus: 'warning' | 'success';
  validationMessage: string;
}

/**
 * Data Transfer Object for order validation results
 */
export interface OrderValidationDto {
  status: 'warning' | 'success';
  message: string;
}
