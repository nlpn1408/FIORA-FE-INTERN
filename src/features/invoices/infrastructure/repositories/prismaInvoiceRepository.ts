import { prisma } from '@/config';
import type { IInvoiceRepository } from '@/features/invoices/application/repositories/invoices.interface';
import type {
  InvoiceRequestDto,
  InvoiceRequestResultDto,
  OrderValidationDto,
} from '@/features/invoices/domain/dtos/invoice-request.dto';
import { orderValidationService } from '@/features/invoices/domain/services/order-validation.service';
import { InvoiceStatus } from '@/features/invoices/domain/entities/models/invoices';
import type { Order as DomainOrder } from '@/features/invoices/domain/entities/models/invoices';
import { Order as PrismaOrder, Prisma, InvoiceStatus as PrismaInvoiceStatus } from '@prisma/client';

export class PrismaInvoiceRepository implements IInvoiceRepository {
  /**
   * Maps a Prisma Order to a Domain Order
   */
  private mapOrderToDomain(prismaOrder: PrismaOrder): DomainOrder {
    return {
      id: prismaOrder.id,
      userId: prismaOrder.userId,
      orderNo: prismaOrder.orderNo,
      datetime: prismaOrder.datetime || undefined,
      totalAmt: Number(prismaOrder.totalAmt), // Convert Decimal to number
      cusName: prismaOrder.cusName,
      address: prismaOrder.address || undefined,
      email: prismaOrder.email || undefined,
      phone: prismaOrder.phone || undefined,
      status: prismaOrder.status,
      createdAt: prismaOrder.createdAt,
      createdBy: prismaOrder.createdBy,
      updatedAt: prismaOrder.updatedAt,
      updatedBy: prismaOrder.updatedBy,
    };
  }

  /**
   * Maps Domain InvoiceStatus to Prisma InvoiceStatus
   */
  private mapInvoiceStatusToPrisma(status: InvoiceStatus): PrismaInvoiceStatus {
    // Since enum values have the same names, we can safely cast
    return status as unknown as PrismaInvoiceStatus;
  }

  /**
   * Generates a sequential request number in the format 'REQ0000001'
   * Uses a transaction to ensure uniqueness even in concurrent scenarios
   */
  private async generateSequentialRequestNumber(tx: Prisma.TransactionClient): Promise<string> {
    // Find the highest reqNo
    const latestInvoice = await tx.invoice.findFirst({
      orderBy: {
        reqNo: 'desc',
      },
      select: {
        reqNo: true,
      },
    });

    // If no invoices exist yet, start with REQ0000001
    if (!latestInvoice) {
      return 'REQ0000001';
    }

    // Extract the numeric part and increment it
    const matches = latestInvoice.reqNo.match(/REQ(\d+)/);
    if (!matches || matches.length < 2) {
      // If for some reason the pattern doesn't match, start from 1
      return 'REQ0000001';
    }

    const currentNumber = parseInt(matches[1], 10);
    const nextNumber = currentNumber + 1;

    // Format the new number with leading zeros (7 digits)
    return `REQ${nextNumber.toString().padStart(7, '0')}`;
  }

  /**
   * Finds an order by its order number
   */
  async findOrderByOrderNo(orderNo: string): Promise<DomainOrder | null> {
    const order = await prisma.order.findUnique({
      where: { orderNo },
    });

    // Map the Prisma order to our domain order if found
    return order ? this.mapOrderToDomain(order) : null;
  }

  /**
   * Validates an order against customer data
   */
  async validateOrder(
    orderNo: string,
    customerData: {
      customerName: string;
      email: string;
      phone?: string | null;
    },
  ): Promise<OrderValidationDto> {
    // Get order data for validation
    const order = await prisma.order.findUnique({
      where: { orderNo },
      select: {
        id: true,
        cusName: true,
        email: true,
        phone: true,
        status: true,
        orderNo: true,
      },
    });

    // Use validation service to check the data
    return orderValidationService.validateOrderMatch(order, customerData);
  }

  /**
   * Creates an invoice request and links it to an order
   */
  async createInvoiceRequest(
    data: InvoiceRequestDto,
    requestingUserId: string | null,
    order: DomainOrder,
  ): Promise<InvoiceRequestResultDto> {
    // Validate the order first to include validation results
    const validationResult = await this.validateOrder(order.orderNo, {
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
    });

    // The status is always Requested
    const domainStatus = InvoiceStatus.Requested;
    // Convert to Prisma status for database operation
    const prismaStatus = this.mapInvoiceStatusToPrisma(domainStatus);

    const result = await prisma.$transaction(async (tx) => {
      // Generate the sequential request number
      const reqNo = await this.generateSequentialRequestNumber(tx);

      // Create invoice data
      const invoiceData: Prisma.InvoiceCreateInput = {
        reqNo: reqNo,
        reqDatetime: new Date(),
        orderNo: order.orderNo,
        cusName: data.customerName,
        taxNo: data.taxNo,
        taxAddress: data.taxAddress,
        email: data.email,
        phone: data.phone,
        status: prismaStatus,
        user: { connect: { id: data.providerId } },
        ...(requestingUserId && {
          creator: { connect: { id: requestingUserId } },
        }),
      };

      // Create the Invoice record
      const invoice = await tx.invoice.create({
        data: invoiceData,
        select: {
          id: true,
          reqNo: true,
        },
      });

      // Create link between order and invoice
      const orderInvoiceData = {
        user: { connect: { id: order.userId } },
        order: { connect: { orderNo: order.orderNo } },
        invoice: { connect: { reqNo: invoice.reqNo } },
        ...(requestingUserId && {
          creator: { connect: { id: requestingUserId } },
        }),
      };

      // Create the OrderInvoice link record
      await tx.orderInvoice.create({
        data: orderInvoiceData,
      });

      // Return both invoice data and validation results
      return {
        invoiceId: invoice.id,
        reqNo: invoice.reqNo,
        orderId: order.id,
        validationStatus: validationResult.status,
        validationMessage: validationResult.message,
        validationTitle: validationResult.title,
      };
    });

    return result;
  }
}

export const prismaInvoiceRepository = new PrismaInvoiceRepository();
