'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function InvoiceRequestForm() {
  const [formData, setFormData] = useState({
    cusName: '',
    taxNo: '',
    orderNo: '',
    email: '',
    phone: '',
    taxAddress: '',
    userId: '',
  });

  const [users, setUsers] = useState([]);
  const [orderStatus, setOrderStatus] = useState<'Paid' | 'Unpaid' | null>(null);

  useEffect(() => {
    handleFindUsers();
  }, []);

  const handleFindOrder = async (orderNo: string) => {
    if (!orderNo) {
      setOrderStatus(null);
      return;
    }

    try {
      const res = await fetch(`/api/order?orderNo=${orderNo}`);
      if (!res.ok) throw new Error('Không tìm thấy đơn hàng');
      const order = await res.json();

      if (order.status !== 'Paid') {
        setOrderStatus('Unpaid');
        toast.error('Đơn hàng chưa thanh toán, không thể tạo yêu cầu hóa đơn.');
      } else {
        setOrderStatus('Paid');
        setFormData((prev) => ({
          ...prev,
          cusName: order.cusName || '',
          taxAddress: order.address || '',
          email: order.email || '',
          phone: order.phone || '',
        }));
        toast.success('Đã tìm thấy thông tin đơn hàng!');
      }
    } catch (err: any) {
      setOrderStatus(null);
      toast.error(err.message || 'Đã xảy ra lỗi khi tìm đơn hàng');
    }
  };

  const handleFindUsers = async () => {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error('Không thể lấy danh sách người dùng');
      const usersData = await res.json();
      setUsers(usersData);
    } catch (err: any) {
      toast.error(err.message || 'Đã xảy ra lỗi khi lấy danh sách người dùng');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'orderNo') {
      handleFindOrder(value); // Kiểm tra mã đơn hàng mỗi khi người dùng nhập
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderStatus !== 'Paid') {
      toast.error('Đơn hàng chưa thanh toán, không thể tạo yêu cầu hóa đơn.');
      return;
    }

    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success('Tạo yêu cầu hóa đơn thành công!');
      setFormData({
        cusName: '',
        taxNo: '',
        orderNo: '',
        email: '',
        phone: '',
        taxAddress: '',
        userId: '',
      });
    } else {
      const error = await res.json();
      toast.error(`Lỗi: ${error.error}`);
    }
  };

  const renderFloatingInput = (
    name: string,
    label: string,
    type: string = 'text',
    extra?: React.ReactNode,
  ) => {
    const hasValue = !!formData[name as keyof typeof formData];

    return (
      <div className="relative w-full">
        <input
          name={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          type={type}
          required
          placeholder=" "
          className="peer w-full border border-gray-300 rounded px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label
          htmlFor={name}
          className={`
            absolute left-3 px-1 bg-white transition-all duration-200
            ${hasValue ? 'text-sm -top-2.5 text-blue-600' : 'top-3.5 text-gray-400'}
            peer-focus:text-sm peer-focus:-top-2.5 peer-focus:text-blue-600
          `}
        >
          {label} <span className="text-red-500">*</span>
        </label>
        {extra}
      </div>
    );
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold text-center mb-10">Request Invoice</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
      >
        {renderFloatingInput('cusName', 'Name')}
        {renderFloatingInput('taxNo', 'Tax code')}

        {/* User select */}
        <div className="relative w-full">
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="peer w-full border border-gray-300 rounded px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value=""></option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
          <label
            htmlFor="userId"
            className={`
              absolute left-3 px-2 bg-white transition-all duration-200
              ${formData.userId ? 'text-sm -top-2.5 text-blue-600' : 'top-3.5 text-gray-400'}
              peer-focus:text-sm peer-focus:-top-2.5 peer-focus:text-blue-600
            `}
          >
            Provider <span className="text-red-500">*</span>
          </label>
        </div>

        {/* Order No */}
        <div className="relative w-full">
          <input
            name="orderNo"
            value={formData.orderNo}
            onChange={handleChange}
            type="text"
            required
            placeholder=" "
            className="peer w-full border border-gray-300 rounded px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="orderNo"
            className={`
              absolute left-3 px-1 bg-white transition-all duration-200
              ${formData.orderNo ? 'text-sm -top-2.5 text-blue-600' : 'top-3.5 text-gray-400'}
              peer-focus:text-sm peer-focus:-top-2.5 peer-focus:text-blue-600
            `}
          >
            Order code <span className="text-red-500">*</span>
          </label>
        </div>

        {renderFloatingInput('email', 'Email', 'email')}
        {renderFloatingInput('phone', 'Phone number')}
        <div className="md:col-span-2">{renderFloatingInput('taxAddress', 'Address')}</div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-center gap-8 mt-6">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-black px-6 py-2 rounded flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            ⬅ Back
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2"
            disabled={orderStatus !== 'Paid'}
          >
            ✅ Submit
          </button>
        </div>
      </form>
    </div>
  );
}
