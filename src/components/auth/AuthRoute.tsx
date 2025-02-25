import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthRouteProps {
  children: React.ReactNode;
}

export default function AuthRoute({ children }: AuthRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to the page they were trying to access (stored in state)
    // or default to home page
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  return <>{children}</>;
} 