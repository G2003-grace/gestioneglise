import { Navigate } from "react-router-dom";
import { useAuth, type Role } from "../context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  roles?: Role[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role))
    return <Navigate to="/membres" replace />;

  return <>{children}</>;
}
