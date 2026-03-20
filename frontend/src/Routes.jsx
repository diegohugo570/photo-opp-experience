import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import PromotorHome from './pages/promotor/Home';
import CaptureProcess from './pages/promotor/CaptureProcess';
import AdminDashboard from './pages/admin/Dashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Carregando...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/'} replace />;
  }

  return children;
};

export default function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      {/* Promotor Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['PROMOTOR']}>
          <PromotorHome />
        </ProtectedRoute>
      } />
      <Route path="/capture" element={
        <ProtectedRoute allowedRoles={['PROMOTOR']}>
          <CaptureProcess />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
