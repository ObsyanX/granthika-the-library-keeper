import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';

/**
 * Returns a function that prepends the correct role-based prefix to a path.
 * Admin: /admin/books, /admin/transactions/issue, etc.
 * User: /user/books, /user/transactions/issue, etc.
 */
export function useBasePath() {
  const { isAdmin } = useAuth();
  
  return useCallback((path: string) => {
    const prefix = isAdmin ? '/admin' : '/user';
    // If path already starts with /admin or /user, return as-is
    if (path.startsWith('/admin') || path.startsWith('/user')) return path;
    // If path is '/', return the prefix (dashboard)
    if (path === '/') return prefix;
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${prefix}${cleanPath}`;
  }, [isAdmin]);
}

/**
 * Static helper for route definitions (non-hook version).
 */
export function buildPath(isAdmin: boolean, path: string): string {
  const prefix = isAdmin ? '/admin' : '/user';
  if (path === '/') return prefix;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${cleanPath}`;
}
