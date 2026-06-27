import { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

export default function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '', categoryId: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  const fetchItems = () => {
    API.get('/items').then((res) => setItems(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchItems();
    API.get('/category').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');
    setLoading(true);
    const formData = new FormData();
    formData.append('item', JSON.stringify({ ...form, price: parseFloat(form.price) }));
    formData.append('file', file);
    try {
      await API.post('/admin/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Item created');
      setShowForm(false);
      setForm({ name: '', price: '', description: '', categoryId: '' });
      setFile(null);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Delete this item?')) return;
    try {
      await API.delete(`/admin/items/${itemId}`);
      toast.success('Item deleted');
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Items</h2>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <HiOutlinePlus className="w-4 h-4" /> Add Item
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="number" step="0.01" placeholder="Price" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} required
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
              ))}
            </select>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
              className="text-sm text-gray-600" />
          </div>
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Item'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.itemId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {item.imgUrl && (
              <div className="h-40 bg-gray-100">
                <img src={item.imgUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-lg font-bold text-blue-600 mt-1">₹{item.price}</p>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(item.itemId)}
                    className="text-red-500 hover:text-red-700 p-1">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">{item.categoryName}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-12">No items yet</p>
        )}
      </div>
    </div>
  );
}
