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

            <Route
              path="productos"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ProductosPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="categorias"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <CategoriasPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="clientes"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ClientesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="usuarios"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UsuariosPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/ventas" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;