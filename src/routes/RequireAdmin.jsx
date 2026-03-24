import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const RequireAdmin = ({ children }) => {
  const { user, authReady, profileLoading } = useAuth();
  const location = useLocation();

  if (!authReady) return null;

  if (!user) {
    const next = location.pathname + location.search + location.hash;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  if (profileLoading || user.profile == null) return null;

  if (String(user.profile.role || "").toLowerCase() !== "admin") {
    return <Navigate to="/account" replace />;
  }

  return children;
};

export default RequireAdmin;
