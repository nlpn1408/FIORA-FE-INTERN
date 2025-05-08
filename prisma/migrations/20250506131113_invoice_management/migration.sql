-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('VND', 'USD');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Unpaid', 'Paid', 'Cancelled', 'Refund');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('Requested', 'Accepted', 'Issuing', 'Issued', 'Replaced', 'Cancelled');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "datetime" TIMESTAMPTZ(0),
    "totalAmt" DECIMAL(9,2) NOT NULL,
    "cusName" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "email" VARCHAR(50),
    "phone" VARCHAR(20),
    "status" "OrderStatus" NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reqNo" VARCHAR(10) NOT NULL,
    "reqDatetime" TIMESTAMPTZ(0) NOT NULL,
    "orderNo" TEXT NOT NULL,
    "cusName" VARCHAR(255) NOT NULL,
    "taxNo" VARCHAR(20),
    "taxAddress" VARCHAR(255),
    "email" VARCHAR(50),
    "phone" VARCHAR(20),
    "status" "InvoiceStatus" NOT NULL,
    "invNo" VARCHAR(50),
    "invDate" DATE,
    "repNo" VARCHAR(50),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderInvoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "invNo" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "OrderInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNo_key" ON "Order"("orderNo");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_createdBy_idx" ON "Order"("createdBy");

-- CreateIndex
CREATE INDEX "Order_updatedBy_idx" ON "Order"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_reqNo_key" ON "Invoice"("reqNo");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invNo_key" ON "Invoice"("invNo");

-- CreateIndex
CREATE INDEX "Invoice_userId_idx" ON "Invoice"("userId");

-- CreateIndex
CREATE INDEX "Invoice_createdBy_idx" ON "Invoice"("createdBy");

-- CreateIndex
CREATE INDEX "Invoice_updatedBy_idx" ON "Invoice"("updatedBy");

-- CreateIndex
CREATE INDEX "OrderInvoice_orderNo_idx" ON "OrderInvoice"("orderNo");

-- CreateIndex
CREATE INDEX "OrderInvoice_invNo_idx" ON "OrderInvoice"("invNo");

-- CreateIndex
CREATE INDEX "OrderInvoice_createdBy_idx" ON "OrderInvoice"("createdBy");

-- CreateIndex
CREATE INDEX "OrderInvoice_updatedBy_idx" ON "OrderInvoice"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "OrderInvoice_orderNo_invNo_key" ON "OrderInvoice"("orderNo", "invNo");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderInvoice" ADD CONSTRAINT "OrderInvoice_invNo_fkey" FOREIGN KEY ("invNo") REFERENCES "Invoice"("reqNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderInvoice" ADD CONSTRAINT "OrderInvoice_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Order"("orderNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderInvoice" ADD CONSTRAINT "OrderInvoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderInvoice" ADD CONSTRAINT "OrderInvoice_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderInvoice" ADD CONSTRAINT "OrderInvoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
