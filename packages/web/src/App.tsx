import React from 'react';
import AuthProvider from './providers/AuthProvider';
import AppRouter from './AppRouter';

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
