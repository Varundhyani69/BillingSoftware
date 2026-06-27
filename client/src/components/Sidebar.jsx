import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineShoppingCart,
  HiOutlineCollection,
  HiOutlineCube,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineLogout,
} from 'react-icons/hi';

export default function Sidebar() {
  const { logout, isAdmin } = useAuth();

  const links = [
    { to: '/', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { to: '/billing', icon: HiOutlineShoppingCart, label: 'Billing' },
    { to: '/categories', icon: HiOutlineCollection, label: 'Categories' },
    { to: '/items', icon: HiOutlineCube, label: 'Items' },
    { to: '/orders', icon: HiOutlineClipboardList, label: 'Orders' },
  ];

  if (isAdmin) {
    links.push({ to: '/users', icon: HiOutlineUsers, label: 'Users' });
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">RetailPOS</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
