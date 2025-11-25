import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStorage.isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // If not authenticated, don't render children while redirecting
  if (!authStorage.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};
