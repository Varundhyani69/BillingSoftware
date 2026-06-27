import { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineMinus, HiOutlineTrash } from 'react-icons/hi';

export default function Billing() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/items').then((res) => setItems(res.data)).catch(() => {});
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.itemId === item.itemId);
      if (existing) {
        return prev.map((c) =>
          c.itemId === item.itemId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { itemId: item.itemId, name: item.name, price: parseFloat(item.price), quantity: 1 }];
    });
  };

  const updateQty = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.itemId === itemId ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((c) => c.itemId !== itemId));
  };

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) return toast.error('Enter customer name');
    if (cart.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const orderPayload = {
        customerName,
        phoneNumber,
        cartItems: cart,
        subtotal,
        tax,
        grandTotal,
        paymentMethod,
      };
      await API.post('/orders', orderPayload);
      toast.success('Order placed successfully!');
      setCart([]);
      setCustomerName('');
      setPhoneNumber('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Items Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Billing</h2>
        <input
          type="text" placeholder="Search items..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-3 content-start">
          {filtered.map((item) => (
            <button key={item.itemId} onClick={() => addToCart(item)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-sm transition">
              {item.imgUrl && (
                <img src={item.imgUrl} alt={item.name} className="w-full h-20 object-cover rounded-lg mb-2" />
              )}
              <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
              <p className="text-blue-600 font-bold text-sm">₹{item.price}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-12">No items found</p>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-96 bg-white border border-gray-200 rounded-xl flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Cart ({cart.length})</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 && (
            <p className="text-gray-400 text-center py-8 text-sm">Add items to cart</p>
          )}
          {cart.map((c) => (
            <div key={c.itemId} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
                <p className="text-xs text-gray-500">₹{c.price} × {c.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(c.itemId, -1)}
                  className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300">
                  <HiOutlineMinus className="w-3 h-3" />
                </button>
                <span className="text-sm font-medium w-6 text-center">{c.quantity}</span>
                <button onClick={() => updateQty(c.itemId, 1)}
                  className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300">
                  <HiOutlinePlus className="w-3 h-3" />
                </button>
                <button onClick={() => removeFromCart(c.itemId)}
                  className="text-red-500 hover:text-red-700 ml-1">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-3">
          <input type="text" placeholder="Customer Name" value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Phone Number" value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
          </select>

          <div className="space-y-1 text-sm pt-2 border-t border-gray-100">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-base pt-1">
              <span>Total</span><span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handlePlaceOrder} disabled={loading || cart.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50">
            {loading ? 'Placing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
