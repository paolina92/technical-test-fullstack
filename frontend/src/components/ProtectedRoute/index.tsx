import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useCurrentUser } from "../../hooks/useCurrentUser";

type ProtectedRouteProps = {
  children: ReactNode;
};

// Redirects unauthenticated users to /signin. Uses hasBearerToken, which is
// computed synchronously from the user-token cookie, so the guard fires
// immediately without waiting for the /api/me query to resolve.
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { hasBearerToken } = useCurrentUser();

  if (!hasBearerToken) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};
