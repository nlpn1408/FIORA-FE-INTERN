import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Lấy tất cả hóa đơn với các bảng liên quan (loại bỏ orderItems)
    const invoices = await prisma.invoice.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderInvoices: {
          include: {
            order: {
              select: {
                id: true,
                orderNo: true,
                totalAmt: true,
                cusName: true,
                address: true,
                phone: true,
                email: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        reqDatetime: 'desc', // Sắp xếp theo ngày yêu cầu giảm dần
      },
    });

    // Lọc ra dữ liệu theo yêu cầu mà không có orderItems
    const invoicesWithOrderDetails = invoices.map((inv) => ({
      id: inv.id,
      cusName: inv.cusName,
      taxAddress: inv.taxAddress,
      date: inv.reqDatetime,

      user: inv.user,
      creator: inv.creator,
      updater: inv.updater,
      orderInvoices: inv.orderInvoices.map((orderInvoice) => ({
        order: {
          orderNo: orderInvoice.order.orderNo,
          totalAmt: orderInvoice.order.totalAmt,
          cusName: orderInvoice.order.cusName,
          address: orderInvoice.order.address,
          phone: orderInvoice.order.phone,
          email: orderInvoice.order.email,
          status: orderInvoice.order.status,
          createdAt: orderInvoice.order.createdAt,
        },
      })),
    }));

    // Trả về kết quả
    res.status(200).json(invoicesWithOrderDetails);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy dữ liệu hóa đơn.' });
  } finally {
    await prisma.$disconnect();
  }
}
