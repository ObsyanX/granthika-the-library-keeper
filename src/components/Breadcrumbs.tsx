import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';

// Route label mappings for human-readable breadcrumbs
const routeLabels: Record<string, string> = {
  admin: 'Dashboard',
  user: 'Dashboard',
  books: 'Books',
  add: 'Add',
  edit: 'Edit',
  transactions: 'Transactions',
  search: 'Search Available',
  issue: 'Issue Book',
  return: 'Return Book',
  fine: 'Pay Fine',
  membership: 'Membership',
  update: 'Update',
  reports: 'Reports',
  users: 'User Management',
  settings: 'Settings',
  profile: 'Profile',
  auth: 'Login',
};

// Parent route mappings for proper hierarchy
const routeParents: Record<string, string> = {
  '/books/add': '/books',
  '/books/edit': '/books',
  '/transactions/search': '/transactions',
  '/transactions/issue': '/transactions',
  '/transactions/return': '/transactions',
  '/transactions/fine': '/transactions',
  '/membership/add': '/membership',
  '/membership/update': '/membership',
  '/membership/edit': '/membership',
  '/admin/settings': '/admin',
};

interface BreadcrumbSegment {
  label: string;
  path: string;
  isLast: boolean;
}

export function Breadcrumbs() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  // Don't show breadcrumbs on root, auth, or home pages
  const hiddenPaths = ['/', '/auth', '/admin', '/user'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [];
    
    // Add home
    const homePath = isAdmin ? '/admin' : '/user';
    breadcrumbs.push({
      label: 'Home',
      path: homePath,
      isLast: false,
    });

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Skip if this is the home path segment (admin/user)
      if (segment === 'admin' || segment === 'user') {
        return;
      }
      
      // Check if segment is a dynamic parameter (UUID or ID)
      const isDynamicSegment = /^[0-9a-f-]{36}$/i.test(segment) || /^\d+$/.test(segment);
      
      let label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      if (isDynamicSegment) {
        // For dynamic segments, use a generic label
        label = 'Details';
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className="mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.path}>
              {crumb.isLast ? (
                <BreadcrumbPage className="flex items-center gap-1.5">
                  {index === 0 && <Home className="h-3.5 w-3.5" />}
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      {index === 0 && <Home className="h-3.5 w-3.5" />}
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </BreadcrumbSeparator>
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
