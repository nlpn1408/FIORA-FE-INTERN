import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { cusName, taxNo, orderNo, email, phone, taxAddress, userId } = data;

    const order = await prisma.order.findUnique({
      where: { orderNo },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const invoice = await prisma.invoice.create({
      data: {
        id: `inv_${Date.now()}`,
        userId,
        reqNo: `REQ${Date.now().toString().slice(-7)}`,
        reqDatetime: new Date(),
        orderNo,
        cusName,
        taxNo,
        taxAddress,
        email,
        phone,
        status: 'Requested',
        createdBy: order.userId,
        updatedBy: order.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
