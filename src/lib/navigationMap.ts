/**
 * Navigation Map Data Structure
 * 
 * This file defines the complete navigation architecture of the Library Management System.
 * It can be used for:
 * - PPT architecture slides
 * - System design diagrams
 * - UML navigation flow
 * - Route documentation
 */

export interface NavigationNode {
  path: string;
  label: string;
  icon?: string;
  description?: string;
  access: 'public' | 'authenticated' | 'admin';
  children?: NavigationNode[];
}

export interface NavigationMap {
  version: string;
  lastUpdated: string;
  routes: NavigationNode[];
}

export const navigationMap: NavigationMap = {
  version: '2.0.0',
  lastUpdated: new Date().toISOString(),
  routes: [
    // Public Routes
    {
      path: '/',
      label: 'Entry Point',
      icon: 'Home',
      description: 'Auto-redirects based on auth status and role',
      access: 'public',
    },
    {
      path: '/auth',
      label: 'Authentication',
      icon: 'LogIn',
      description: 'Login and signup page',
      access: 'public',
    },

    // Admin Routes
    {
      path: '/admin',
      label: 'Admin Dashboard',
      icon: 'LayoutDashboard',
      description: 'Admin overview with system metrics',
      access: 'admin',
      children: [
        {
          path: '/admin/settings',
          label: 'Settings',
          icon: 'Settings',
          description: 'Library configuration settings',
          access: 'admin',
        },
      ],
    },

    // User Routes
    {
      path: '/user',
      label: 'User Dashboard',
      icon: 'LayoutDashboard',
      description: 'Personal dashboard with borrowing status',
      access: 'authenticated',
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: 'User',
      description: 'User profile management',
      access: 'authenticated',
    },

    // Books Module
    {
      path: '/books',
      label: 'Books',
      icon: 'BookOpen',
      description: 'Book catalog and search',
      access: 'authenticated',
      children: [
        {
          path: '/books/add',
          label: 'Add Book',
          icon: 'PlusCircle',
          description: 'Add new book to catalog',
          access: 'admin',
        },
        {
          path: '/books/edit/:serialNo',
          label: 'Edit Book',
          icon: 'Edit',
          description: 'Edit existing book details',
          access: 'admin',
        },
      ],
    },

    // Transactions Module
    {
      path: '/transactions',
      label: 'Transactions',
      icon: 'RefreshCw',
      description: 'View all transactions',
      access: 'authenticated',
      children: [
        {
          path: '/transactions/search',
          label: 'Search Available',
          icon: 'Search',
          description: 'Find available books',
          access: 'authenticated',
        },
        {
          path: '/transactions/issue',
          label: 'Issue Book',
          icon: 'PlusCircle',
          description: 'Borrow a book',
          access: 'authenticated',
        },
        {
          path: '/transactions/return',
          label: 'Return Book',
          icon: 'RefreshCw',
          description: 'Return a borrowed book',
          access: 'authenticated',
        },
        {
          path: '/transactions/fine',
          label: 'Pay Fine',
          icon: 'CreditCard',
          description: 'Pay or record fine payments',
          access: 'authenticated',
        },
      ],
    },

    // Membership Module (Admin Only)
    {
      path: '/membership',
      label: 'Membership',
      icon: 'Users',
      description: 'Member management',
      access: 'admin',
      children: [
        {
          path: '/membership/add',
          label: 'Add Member',
          icon: 'UserPlus',
          description: 'Create new membership',
          access: 'admin',
        },
        {
          path: '/membership/update',
          label: 'Update Member',
          icon: 'Edit',
          description: 'Search and update member',
          access: 'admin',
        },
        {
          path: '/membership/edit/:membershipNo',
          label: 'Edit Member',
          icon: 'Edit',
          description: 'Edit specific member details',
          access: 'admin',
        },
      ],
    },

    // User Management (Admin Only)
    {
      path: '/users',
      label: 'User Management',
      icon: 'Users',
      description: 'Manage system users and roles',
      access: 'admin',
    },

    // Reports Module
    {
      path: '/reports',
      label: 'Reports',
      icon: 'BarChart3',
      description: 'View reports (role-filtered content)',
      access: 'authenticated',
    },
  ],
};

/**
 * Get flat list of all routes
 */
export function getAllRoutes(): NavigationNode[] {
  const routes: NavigationNode[] = [];
  
  function traverse(nodes: NavigationNode[]) {
    for (const node of nodes) {
      routes.push(node);
      if (node.children) {
        traverse(node.children);
      }
    }
  }
  
  traverse(navigationMap.routes);
  return routes;
}

/**
 * Get routes by access level
 */
export function getRoutesByAccess(access: 'public' | 'authenticated' | 'admin'): NavigationNode[] {
  return getAllRoutes().filter(route => route.access === access);
}

/**
 * Get admin-only routes
 */
export function getAdminRoutes(): NavigationNode[] {
  return getRoutesByAccess('admin');
}

/**
 * Generate Mermaid diagram for navigation flow
 */
export function generateMermaidDiagram(): string {
  let diagram = 'graph TD\n';
  diagram += '    START["/"] --> |Unauthenticated| AUTH["/auth"]\n';
  diagram += '    START --> |Admin| ADMIN["/admin"]\n';
  diagram += '    START --> |User| USER["/user"]\n';
  diagram += '    \n';
  diagram += '    subgraph "Admin Routes"\n';
  diagram += '        ADMIN --> ADMIN_SETTINGS["/admin/settings"]\n';
  diagram += '        ADMIN --> BOOKS_ADD["/books/add"]\n';
  diagram += '        ADMIN --> MEMBERSHIP["/membership"]\n';
  diagram += '        ADMIN --> USERS["/users"]\n';
  diagram += '        MEMBERSHIP --> MEMBERSHIP_ADD["/membership/add"]\n';
  diagram += '        MEMBERSHIP --> MEMBERSHIP_UPDATE["/membership/update"]\n';
  diagram += '    end\n';
  diagram += '    \n';
  diagram += '    subgraph "Shared Routes"\n';
  diagram += '        BOOKS["/books"]\n';
  diagram += '        TRANSACTIONS["/transactions"]\n';
  diagram += '        REPORTS["/reports"]\n';
  diagram += '        TRANSACTIONS --> TX_SEARCH["/transactions/search"]\n';
  diagram += '        TRANSACTIONS --> TX_ISSUE["/transactions/issue"]\n';
  diagram += '        TRANSACTIONS --> TX_RETURN["/transactions/return"]\n';
  diagram += '        TRANSACTIONS --> TX_FINE["/transactions/fine"]\n';
  diagram += '    end\n';
  diagram += '    \n';
  diagram += '    subgraph "User Routes"\n';
  diagram += '        USER --> PROFILE["/profile"]\n';
  diagram += '    end\n';
  diagram += '    \n';
  diagram += '    ADMIN --> BOOKS\n';
  diagram += '    ADMIN --> TRANSACTIONS\n';
  diagram += '    ADMIN --> REPORTS\n';
  diagram += '    USER --> BOOKS\n';
  diagram += '    USER --> TRANSACTIONS\n';
  diagram += '    USER --> REPORTS\n';
  
  return diagram;
}

/**
 * Navigation sidebar configurations per role
 */
export const sidebarConfig = {
  admin: [
    {
      group: 'Overview',
      items: [
        { to: '/admin', icon: 'Home', label: 'Dashboard' },
        { to: '/books', icon: 'BookOpen', label: 'Catalog' },
      ],
    },
    {
      group: 'Transactions',
      items: [
        { to: '/transactions', icon: 'RefreshCw', label: 'All Transactions' },
        { to: '/transactions/issue', icon: 'PlusCircle', label: 'Issue Book' },
        { to: '/transactions/return', icon: 'RefreshCw', label: 'Return Book' },
        { to: '/transactions/fine', icon: 'CreditCard', label: 'Record Fine' },
      ],
    },
    {
      group: 'Members',
      items: [
        { to: '/membership', icon: 'Users', label: 'All Members' },
        { to: '/membership/add', icon: 'UserPlus', label: 'Add Member' },
      ],
    },
    {
      group: 'Administration',
      items: [
        { to: '/books/add', icon: 'PlusCircle', label: 'Add Book' },
        { to: '/users', icon: 'Users', label: 'User Accounts' },
        { to: '/admin/settings', icon: 'Settings', label: 'Settings' },
      ],
    },
    {
      group: 'Reports',
      items: [
        { to: '/reports', icon: 'BarChart3', label: 'All Reports' },
      ],
    },
  ],
  user: [
    {
      group: 'Overview',
      items: [
        { to: '/user', icon: 'Home', label: 'Dashboard' },
        { to: '/books', icon: 'BookOpen', label: 'Books' },
      ],
    },
    {
      group: 'Transactions',
      items: [
        { to: '/transactions', icon: 'RefreshCw', label: 'My Transactions' },
        { to: '/transactions/issue', icon: 'PlusCircle', label: 'Borrow Book' },
        { to: '/transactions/return', icon: 'RefreshCw', label: 'Return Book' },
        { to: '/transactions/fine', icon: 'CreditCard', label: 'Pay Fine' },
      ],
    },
    {
      group: 'Reports',
      items: [
        { to: '/reports', icon: 'BarChart3', label: 'My Reports' },
      ],
    },
    {
      group: 'Account',
      items: [
        { to: '/profile', icon: 'User', label: 'Profile' },
      ],
    },
  ],
};
