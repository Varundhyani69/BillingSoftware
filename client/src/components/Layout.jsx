import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-4">
            <span className="text-sm text-gray-500">
              {user?.email} ({user?.role?.replace('ROLE_', '')})
            </span>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
