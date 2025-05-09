// // // import { NextResponse } from 'next/server'
// // // import { PrismaClient } from '@prisma/client'

// // // const prisma = new PrismaClient()

// // // // GET - Lấy danh sách Invoice
// // // export async function GET() {
// // //   const invoices = await prisma.invoice.findMany({
// // //     orderBy: { createdAt: 'desc' },
// // //   })
// // //   return NextResponse.json(invoices)
// // // }

// // // export async function POST(req: Request) {
// // //   const body = await req.json()
// // //   console.log('📥 Invoice body received:', body) // <-- In ra body

// // //   try {
// // //     const newInvoice = await prisma.invoice.create({
// // //       data: {
// // //         userId: body.userId,
// // //         reqNo: `REQ${Date.now().toString().slice(-6)}`,
// // //         reqDatetime: new Date(body.reqDatetime),
// // //         orderNo: body.orderNo,
// // //         cusName: body.cusName,
// // //         taxNo: body.taxNo || null,
// // //         taxAddress: body.taxAddress || null,
// // //         email: body.email || null,
// // //         phone: body.phone || null,
// // //         status: 'Requested',
// // //         createdAt: new Date(),
// // //         updatedAt: new Date(),
// // //       },
// // //     })

// // //     return NextResponse.json(newInvoice)
// // //   } catch (err: any) {
// // //     console.error('❌ Create invoice failed:', err) // <-- In ra lỗi gốc
// // //     return NextResponse.json(
// // //       { error: 'Tạo hóa đơn thất bại', details: err.message || err },
// // //       { status: 500 }
// // //     )
// // //   }
// // // }

// // import { NextResponse } from 'next/server'
// // import { PrismaClient } from '@prisma/client'
// // import { v4 as uuidv4 } from 'uuid'
// // const prisma = new PrismaClient()
// // import { NextRequest} from 'next/server';

// // // GET - Lấy danh sách hóa đơn
// // export async function GET() {
// //   const invoices = await prisma.invoice.findMany({
// //     orderBy: { createdAt: 'desc' },
// //   })
// //   return NextResponse.json(invoices)
// // }
// // export async function POST(req: NextRequest) {
// //   try {
// //     const body = await req.json()
// //     const { cusName, taxNo, orderNo, email, phone, taxAddress } = body

// //     if (!cusName || !taxNo || !orderNo || !email || !phone || !taxAddress) {
// //       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
// //     }

// //     const invoice = await prisma.invoice.create({
// //       data: {
// //         id: `inv_${uuidv4()}`,
// //         userId: 'user_001',
// //         reqNo: `REQ${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
// //         reqDatetime: new Date(),
// //         orderNo,
// //         cusName,
// //         taxNo,
// //         taxAddress,
// //         email,
// //         phone,
// //         status: 'Requested',
// //         createdBy: 'user_001',
// //         updatedBy: 'user_001',
// //         createdAt: new Date(),
// //         updatedAt: new Date(),
// //       },
// //     })

// //     return NextResponse.json(invoice, { status: 201 })
// //   } catch (error) {
// //     console.error('Error creating invoice:', error)
// //     return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
// //   }
// // }

import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(invoices);
}
// export async function POST(req: NextRequest) {
//   try {
//     const data = await req.json();

//     const {
//       cusName,
//       taxNo,
//       orderNo,
//       email,
//       phone,
//       taxAddress,
//     } = data;

//     const order = await prisma.order.findUnique({
//       where: { orderNo },
//     });

//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     const invoice = await prisma.invoice.create({
//       data: {
//         id: `inv_${Date.now()}`,
//         userId: order.userId,
//         reqNo: `REQ${Date.now().toString().slice(-7)}`, // Gen mã đơn
//         reqDatetime: new Date(),
//         orderNo,
//         cusName,
//         taxNo,
//         taxAddress,
//         email,
//         phone,
//         status: 'Requested',
//         createdBy: order.userId,
//         updatedBy: order.userId,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });

//     return NextResponse.json(invoice);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   const data = await req.json();
//   const { cusName, taxNo, orderNo, email, phone, taxAddress, userId } = data;

//   if (!userId) {
//     return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 });
//   }

//   const user = await prisma.user.findUnique({ where: { id: userId } });
//   if (!user || user.role !== 'User') {
//     return NextResponse.json({ error: 'Người dùng không hợp lệ' }, { status: 400 });
//   }

//   const invoice = await prisma.invoice.create({
//     data: {
//       id: `inv_${Date.now()}`,
//       userId,
//       reqNo: `REQ${Date.now().toString().slice(-7)}`,
//       reqDatetime: new Date(),
//       orderNo,
//       cusName,
//       taxNo,
//       taxAddress,
//       email,
//       phone,
//       status: 'Requested',
//       createdBy: userId,
//       updatedBy: userId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   });

//   return NextResponse.json(invoice);
// }

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
