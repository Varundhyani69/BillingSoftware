import { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ROLE_USER' });
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    API.get('/admin/users').then((res) => setUsers(res.data)).catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/admin/register', form);
      toast.success('User created');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', role: 'ROLE_USER' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <HiOutlinePlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="Password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ROLE_USER">User</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Role</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Created</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{u.name}</td>
                <td className="px-6 py-4 text-gray-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.role === 'ROLE_ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>{u.role?.replace('ROLE_', '')}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(u.userId)}
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
  );
}
