import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Wraps any route that needs authentication (and optionally a specific role)
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
