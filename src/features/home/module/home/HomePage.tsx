'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ✅ Định nghĩa kiểu trạng thái hóa đơn
type InvoiceStatus =
  | 'Accepted'
  | 'Issuing'
  | 'Cancel'
  | 'Cancelled'
  | 'Replace'
  | 'Replaced'
  | 'Issued'
  | 'Request';

// ✅ Map màu trạng thái
const statusColor: Record<InvoiceStatus, string> = {
  Accepted: 'text-blue-500',
  Issuing: 'text-orange-500',
  Cancel: 'text-red-500',
  Cancelled: 'text-red-500',
  Replace: 'text-purple-500',
  Replaced: 'text-purple-500',
  Issued: 'text-green-500',
  Request: 'text-yellow-500',
};

// ✅ Dữ liệu biểu đồ & bảng
export default function InvoiceDashboard() {
  const [data] = useState<{ status: InvoiceStatus; count: number }[]>([
    { status: 'Request', count: 5 },
    { status: 'Accepted', count: 15 },
    { status: 'Issuing', count: 20 },
    { status: 'Issued', count: 30 },
    { status: 'Replaced', count: 10 },
    { status: 'Cancelled', count: 3 },
  ]);

  const [invoices] = useState<
    {
      id: number;
      name: string;
      taxNo: string;
      order: string;
      email: string;
      invoice: string;
      amount: string;
      status: InvoiceStatus;
      date: string;
      time: string;
    }[]
  >([
    {
      id: 1,
      name: 'Khoa Ngô',
      taxNo: '23745',
      order: 'OR01',
      email: 'abc@gmail.com',
      invoice: 'INV01',
      amount: '3.000.000',
      status: 'Accepted',
      date: '02/05/2025',
      time: '02/05/2025',
    },
    {
      id: 2,
      name: 'Nghĩa',
      taxNo: '23425',
      order: 'OR02',
      email: 'abc@gmail.com',
      invoice: 'INV01',
      amount: '3.000.000',
      status: 'Issued',
      date: '02/05/2025',
      time: '02/05/2025',
    },
    {
      id: 3,
      name: 'Nhật Anh',
      taxNo: '23742',
      order: 'OR03',
      email: 'abc@gmail.com',
      invoice: 'INV01',
      amount: '3.000.000',
      status: 'Issuing',
      date: '02/05/2025',
      time: '02/05/2025',
    },
    {
      id: 4,
      name: 'Anh Khoa',
      taxNo: '27425',
      order: 'OR04',
      email: 'abc@gmail.com',
      invoice: 'INV01',
      amount: '3.000.000',
      status: 'Cancel',
      date: '02/05/2025',
      time: '02/05/2025',
    },
    {
      id: 5,
      name: 'Thanh Bạch',
      taxNo: '37425',
      order: 'OR05',
      email: 'abc@gmail.com',
      invoice: 'INV01',
      amount: '3.000.000',
      status: 'Replace',
      date: '02/05/2025',
      time: '02/05/2025',
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Biểu đồ */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Invoices Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 10, right: 20, left: 30, bottom: 10 }} // 👈 thêm dòng này
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="status" />
              <Tooltip />
              <Bar dataKey="count" fill="#f472b6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bảng hóa đơn */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Invoices Dashboard</h3>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Tax No</TableHead>
                  <TableHead>Order No</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Request Date Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.id}</TableCell>
                    <TableCell>{inv.name}</TableCell>
                    <TableCell>{inv.taxNo}</TableCell>
                    <TableCell>{inv.order}</TableCell>
                    <TableCell>{inv.email}</TableCell>
                    <TableCell>{inv.invoice}</TableCell>
                    <TableCell>{inv.amount}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded font-medium ${
                          statusColor[inv.status] ?? 'text-gray-500'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>{inv.time}</TableCell>
                    <TableCell>
                      <button className="text-sm text-gray-500 hover:text-blue-600">🔍</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
