import { type ReactElement } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import LoginPage from "../features/auth/components/LoginPage.tsx";
import SignupPage from "../features/auth/components/SignupPage.tsx";
import { authStore } from "./store";
import ProtectedPage from "../features/auth/components/ProtectedPage.tsx";

function RequireAuth({ children }: { children: ReactElement }): ReactElement {
  const token = authStore.state.token;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function AppRouter(): ReactElement {
  const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/login" replace /> },
    {
      path: "/login",
      element: (
        <LoginPage onSuccess={() => (window.location.href = "/protected")} />
      ),
    },
    {
      path: "/signup",
      element: (
        <SignupPage onSuccess={() => (window.location.href = "/protected")} />
      ),
    },
    {
      path: "/protected",
      element: (
        <RequireAuth>
          <ProtectedPage />
        </RequireAuth>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
}

export const Router = AppRouter;
