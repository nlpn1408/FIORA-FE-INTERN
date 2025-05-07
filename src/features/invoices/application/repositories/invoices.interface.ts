import type {
  InvoiceRequestDto,
  InvoiceRequestResultDto,
  OrderValidationDto,
} from '@/features/invoices/domain/dtos/invoice-request.dto';
import type { Order } from '@/features/invoices/domain/entities/models/invoices';

export interface IInvoiceRepository {
  /**
   * Finds an order by its order number
   */
  findOrderByOrderNo(orderNo: string): Promise<Order | null>;

  /**
   * Validates an order against customer data
   */
  validateOrder(
    orderNo: string,
    customerData: {
      customerName: string;
      email: string;
      phone?: string | null;
    },
  ): Promise<OrderValidationDto>;

  /**
   * Creates an invoice request
   */
  createInvoiceRequest(
    data: InvoiceRequestDto,
    requestingUserId: string | null,
    order: Order,
  ): Promise<InvoiceRequestResultDto>;
}
