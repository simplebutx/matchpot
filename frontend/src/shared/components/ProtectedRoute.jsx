import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

function parseJwtPayload(token) {
  const payload = token?.split('.')[1];
  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');

    return JSON.parse(atob(normalizedPayload));
  } catch (error) {
    console.error('Failed to parse JWT payload:', error);
    return null;
  }
}

function getCurrentUserRole() {
  const token = localStorage.getItem('token');
  const decodedPayload = parseJwtPayload(token);
  const tokenRole = decodedPayload?.role;

  if (tokenRole) {
    localStorage.setItem('role', tokenRole);
    return tokenRole;
  }

  return localStorage.getItem('role');
}

export default function ProtectedRoute({ requireRole }) {
  const token = localStorage.getItem('token');
  const role = getCurrentUserRole();
  const location = useLocation();

  const allowedRoles = Array.isArray(requireRole)
    ? requireRole
    : requireRole
      ? [requireRole]
      : [];

  const hasRequiredRole = !allowedRoles.length || allowedRoles.includes(role);

  useEffect(() => {
    if (!token) {
      toast.error('로그인 후 이용 가능합니다.');
      return;
    }

    if (!hasRequiredRole) {
      toast.error('접근 권한이 없습니다.');
    }
  }, [token, hasRequiredRole]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
