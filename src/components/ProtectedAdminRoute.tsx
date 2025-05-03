import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = Cookies.get('admin_view') === 'true';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
