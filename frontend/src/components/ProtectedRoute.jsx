import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-chathaven-bg-main">
        <div className="text-chathaven-text-primary">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
