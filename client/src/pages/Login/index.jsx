import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/login', { email, password });
      login(data.email, data.token, data.role);
      toast.success('Login successful');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
        <p className="text-gray-500 text-sm mb-8">Sign in to your RetailPOS account</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">Test Credentials</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600 font-medium">Admin (Owner):</span>
                <span className="text-gray-500 ml-1">admin@retail.com / admin123</span>
              </div>
              <button type="button" onClick={() => { setEmail('admin@retail.com'); setPassword('admin123'); }}
                className="text-blue-600 hover:text-blue-700 font-medium">Use</button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600 font-medium">Cashier:</span>
                <span className="text-gray-500 ml-1">varun@cashier.com / cashier</span>
              </div>
              <button type="button" onClick={() => { setEmail('varun@cashier.com'); setPassword('cashier'); }}
                className="text-blue-600 hover:text-blue-700 font-medium">Use</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
