import { PrismaClient, OrderStatus, InvoiceStatus, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface SeedData {
  users: any[];
  orders: any[];
  invoiceRequests: any[];
}

async function main() {
  console.log(`Start seeding ...`);

  // --- Clean up previous data ---
  console.log('Cleaning up existing data...');
  
  // Delete in the correct order to respect foreign key constraints
  console.log('Deleting OrderInvoice records...');
  await prisma.orderInvoice.deleteMany({});
  
  console.log('Deleting Invoice records...');
  await prisma.invoice.deleteMany({});
  
  console.log('Deleting Order records...');
  await prisma.order.deleteMany({});
  
  console.log('Data cleanup completed.');

  // --- Read Seed Data from JSON ---
  let seedData: SeedData;
  try {
    const jsonPath = path.join(__dirname, 'seed.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    seedData = JSON.parse(jsonData);
    console.log(`Read seed data from seed.json`);
  } catch (error) {
    console.error('Error reading or parsing seed.json:', error);
    throw new Error('Could not load seed data.');
  }

  // --- Seed Users ---
  for (const userData of seedData.users) {
    const hashedPassword = await hash(userData.password, 10);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        role: userData.role as UserRole,
      },
    });
    console.log(`Upserted user with id: ${user.id}`);
  }

  // --- Seed Orders ---
  for (const orderData of seedData.orders) {
    const order = await prisma.order.create({
      data: {
        id: orderData.id,
        orderNo: orderData.orderNo,
        userId: orderData.userId,
        totalAmt: orderData.totalAmt,
        cusName: orderData.cusName,
        address: orderData.address,
        email: orderData.email,
        phone: orderData.phone,
        status: orderData.status as OrderStatus,
        createdBy: orderData.createdBy,
      },
    });
    console.log(`Created order with id: ${order.id}`);
  }

  // --- Seed Invoices and Links ---
  for (const invReqData of seedData.invoiceRequests) {
    // Ensure related order exists before creating invoice
    const orderExists = await prisma.order.findUnique({
      where: { orderNo: invReqData.orderNo },
    });

    if (!orderExists) {
      console.warn(
        `Skipping invoice request ${invReqData.reqNo}: Order ${invReqData.orderNo} not found.`,
      );
      continue;
    }

    // Create the invoice
    const invoice = await prisma.invoice.create({
      data: {
        id: invReqData.id,
        userId: invReqData.providerId, // Use providerId for the userId field
        reqNo: invReqData.reqNo,
        reqDatetime: new Date(),
        orderNo: invReqData.orderNo,
        cusName: invReqData.cusName,
        taxNo: invReqData.taxNo,
        taxAddress: invReqData.taxAddress,
        email: invReqData.email,
        phone: invReqData.phone,
        invNo: invReqData.invNo,
        invDate: invReqData.invDate ? new Date(invReqData.invDate) : null,
        repNo: invReqData.repNo,
        status: invReqData.status as InvoiceStatus,
        createdBy: invReqData.createdBy,
      },
    });
    console.log(`Created invoice request with id: ${invoice.id}`);

    // Link Invoice to Order - only for invoices with status Issued
    if (invReqData.invNo) {
      await prisma.orderInvoice.create({
        data: {
          orderNo: invReqData.orderNo,
          invNo: invReqData.reqNo, // Use reqNo as the foreign key to Invoice
          userId: invReqData.userId || orderExists.userId,
          createdBy: invReqData.createdBy,
        },
      });
      console.log(`Created link for Invoice ${invoice.id} to Order ${invReqData.orderNo}`);
    } else {
      console.log(`Skipping order-invoice link for ${invoice.id} as it has no invNo`);
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
