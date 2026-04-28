import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isSignedIn } from '../auth';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!isSignedIn()) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/signin?from=${encodeURIComponent(from)}`} replace />;
  }
  return children;
}
