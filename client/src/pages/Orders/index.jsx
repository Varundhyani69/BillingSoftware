import { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineTrash } from 'react-icons/hi';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    API.get('/orders/latest')
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (orderId) => {
    if (!confirm('Delete this order?')) return;
    try {
      await API.delete(`/orders/${orderId}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Order ID</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Phone</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Items</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Total</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Payment</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No orders yet</td></tr>
              )}
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{order.orderId}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4 text-gray-500">{order.phoneNumber}</td>
                  <td className="px-6 py-4">{order.items?.length || 0}</td>
                  <td className="px-6 py-4 font-medium">₹{order.grandTotal?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentMethod === 'CASH' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                    }`}>{order.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(order.orderId)}
                      className="text-red-500 hover:text-red-700 p-1">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
