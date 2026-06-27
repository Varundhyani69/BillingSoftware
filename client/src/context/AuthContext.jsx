import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    if (token && email && role) return { token, email, role };
    return null;
  });

  const login = (email, token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    setUser({ token, email, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setUser(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
