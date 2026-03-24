import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";


const RequireAuth = ({ children }) => {
  const { user, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return null;
  }

  if (!user) {
    const next = location.pathname + location.search + location.hash;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }

  return children;
}

export default RequireAuth;