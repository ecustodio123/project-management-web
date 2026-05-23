import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/authContext";
import { paths } from "./paths";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={paths.projects} replace />;
  }

  return <Outlet />;
}
