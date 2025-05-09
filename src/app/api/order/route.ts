import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNo = searchParams.get('orderNo');

  if (!orderNo) {
    return NextResponse.json({ error: 'Missing orderNo' }, { status: 400 });
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        orderNo,
        status: OrderStatus.Paid,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Paid order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
