import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './features/auth/pages/LoginPage';
import { VentasPage } from './features/ventas/pages/VentasPage';
import { ProductosPage } from './features/productos/pages/ProductosPage';
import { CategoriasPage } from './features/productos/pages/CategoriasPage';
import { ClientesPage } from './features/clientes/pages/ClientesPage';
import { UsuariosPage } from './features/usuarios/pages/UsuariosPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/ventas" replace />} />
            <Route path="ventas" element={<VentasPage />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="categorias" element={<CategoriasPage />} />
            <Route path="clientes" element={<ClientesPage />} />

            <Route
              path="usuarios"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ADMINISTRADOR']}>
                  <UsuariosPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;