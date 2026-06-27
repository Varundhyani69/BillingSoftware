import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { HiOutlineCurrencyRupee, HiOutlineShoppingCart } from 'react-icons/hi';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <HiOutlineCurrencyRupee className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-800">₹{data?.todaySales?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <HiOutlineShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-800">{data?.todayOrderCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Order ID</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Amount</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Payment</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.recentOrders?.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
              )}
              {data?.recentOrders?.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{order.orderId}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4 font-medium">₹{order.grandTotal?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentMethod === 'CASH' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                    }`}>{order.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
