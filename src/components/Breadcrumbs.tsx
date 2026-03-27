import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';

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
  dashboard: 'Dashboard',
};

interface BreadcrumbSegment {
  label: string;
  path: string;
  isLast: boolean;
}

export function Breadcrumbs() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const homePath = isAdmin ? '/admin' : '/user';
  
  // Don't show breadcrumbs on root, auth, or home pages
  if (['/', '/auth', '/admin', '/user'].includes(location.pathname)) {
    return null;
  }

  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [];
    
    breadcrumbs.push({ label: 'Home', path: homePath, isLast: false });

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Skip the role prefix (admin/user) as it's represented by "Home"
      if (index === 0 && (segment === 'admin' || segment === 'user')) {
        return;
      }
      
      const isDynamicSegment = /^[0-9a-f-]{36}$/i.test(segment) || /^\d+$/.test(segment);
      let label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      if (isDynamicSegment) label = 'Details';

      breadcrumbs.push({ label, path: currentPath, isLast });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  if (breadcrumbs.length <= 1) return null;

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
