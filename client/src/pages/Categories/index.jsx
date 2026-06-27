import { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', bgColor: '#3b82f6' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  const fetchCategories = () => {
    API.get('/category').then((res) => setCategories(res.data)).catch(() => {});
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');
    setLoading(true);
    const formData = new FormData();
    formData.append('category', JSON.stringify(form));
    formData.append('file', file);
    try {
      await API.post('/admin/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Category created');
      setShowForm(false);
      setForm({ name: '', description: '', bgColor: '#3b82f6' });
      setFile(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Delete this category?')) return;
    try {
      await API.delete(`/admin/categories/${categoryId}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Category
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text" placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Color:</label>
              <input type="color" value={form.bgColor}
                onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer" />
            </div>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
              className="text-sm text-gray-600" />
          </div>
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.categoryId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {cat.imgUrl && (
              <div className="h-32 bg-gray-100" style={{ backgroundColor: cat.bgColor }}>
                <img src={cat.imgUrl} alt={cat.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                {isAdmin && (
                  <button onClick={() => handleDelete(cat.categoryId)}
                    className="text-red-500 hover:text-red-700 p-1">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
              <p className="text-xs text-gray-400 mt-2">{cat.items || 0} items</p>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-12">No categories yet</p>
        )}
      </div>
    </div>
  );
}
