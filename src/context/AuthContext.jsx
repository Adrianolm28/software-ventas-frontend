import { createContext, useContext, useState } from 'react';
import { authService } from '../features/auth/services/authService';

const AuthContext = createContext(null);

const leerUsuario = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(leerUsuario);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    const usuario = { username: data.username, rol: data.rol };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(usuario));
    setUser(usuario);
    return usuario;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (...roles) => !!user && roles.includes(user.rol);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, hasRole, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
