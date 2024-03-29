import React, { useMemo } from 'react';
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from 'react-router-dom';

import { ErrorBoundary } from './components';

import Home from './views/home';
import Login from './views/login';
import { useAuth } from './providers/AuthProvider';


export default function AppRouter(): JSX.Element {
  const { isAuthenticated } = useAuth();

  const router = useMemo(() => {
    const root: RouteObject[] = [{
      path: '/home',
      element: <Home />,
      errorElement: <ErrorBoundary />,
    }, {
      path: '/login',
      element: <Login />,
      errorElement: <ErrorBoundary />,
    }, {
      path: '*',
      element: <Navigate to={isAuthenticated ? '/home' : '/login'} />,
    }];

    return createBrowserRouter(root);
  }, [isAuthenticated]);

  return (
    <RouterProvider router={router} />
  );
}
