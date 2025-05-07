import type { IInvoiceRepository } from '@/features/invoices/application/repositories/invoices.interface';
import type {
  InvoiceRequestDto,
  InvoiceRequestResultDto,
} from '@/features/invoices/domain/dtos/invoice-request.dto';
import {
  OrderNotFoundError,
  InvoiceCreationError,
} from '@/features/invoices/domain/entities/errors/invoiceErrors';

/**
 * Use Case for handling the request for a new invoice.
 */
export class RequestInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  /**
   * Processes an invoice request
   * @param input - Data required to request an invoice
   * @param requestingUserId - User ID making the request (null if guest)
   * @returns Result of the invoice request with validation status
   * @throws OrderNotFoundError if the order doesn't exist
   * @throws InvoiceCreationError if invoice creation fails
   */
  async execute(
    input: InvoiceRequestDto,
    requestingUserId: string | null,
  ): Promise<InvoiceRequestResultDto> {
    // 1. Find the order first to ensure it exists
    const order = await this.invoiceRepository.findOrderByOrderNo(input.orderNo);
    if (!order) {
      throw new OrderNotFoundError(input.orderNo);
    }

    try {
      // 2. Create the invoice request and get validation results
      return await this.invoiceRepository.createInvoiceRequest(input, requestingUserId, order);
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error during invoice request creation:', error.stack);
      }
      throw new InvoiceCreationError('Failed to create invoice request.');
    }
  }
}
