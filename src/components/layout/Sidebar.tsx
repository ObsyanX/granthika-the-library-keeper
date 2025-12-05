import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  RefreshCw, 
  FileText, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  PlusCircle,
  Search,
  Edit
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

function NavItem({ to, icon: Icon, label, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
          'hover:bg-primary/10',
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground',
          collapsed && 'justify-center px-2'
        )
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="font-medium">{label}</span>}
    </NavLink>
  );
}

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  collapsed: boolean;
}

function NavGroup({ title, children, collapsed }: NavGroupProps) {
  return (
    <div className="space-y-1">
      {!collapsed && (
        <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export function Sidebar() {
  const { isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        'hidden md:flex flex-col bg-card border-r border-border h-[calc(100vh-64px)] sticky top-16 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {/* Main */}
        <NavGroup title="Main" collapsed={collapsed}>
          <NavItem to="/dashboard" icon={Home} label="Dashboard" collapsed={collapsed} />
        </NavGroup>

        {/* Catalog */}
        <NavGroup title="Catalog" collapsed={collapsed}>
          <NavItem to="/books" icon={BookOpen} label="All Books" collapsed={collapsed} />
          {isAdmin && (
            <NavItem to="/books/add" icon={PlusCircle} label="Add Book" collapsed={collapsed} />
          )}
        </NavGroup>

        {/* Transactions */}
        <NavGroup title="Transactions" collapsed={collapsed}>
          <NavItem to="/transactions" icon={RefreshCw} label="Overview" collapsed={collapsed} />
          <NavItem to="/transactions/search" icon={Search} label="Book Available" collapsed={collapsed} />
          <NavItem to="/transactions/issue" icon={BookOpen} label="Issue Book" collapsed={collapsed} />
          <NavItem to="/transactions/return" icon={RefreshCw} label="Return Book" collapsed={collapsed} />
          {isAdmin && (
            <NavItem to="/transactions/fine" icon={CreditCard} label="Pay Fine" collapsed={collapsed} />
          )}
        </NavGroup>

        {/* Membership (Admin Only) */}
        {isAdmin && (
          <NavGroup title="Membership" collapsed={collapsed}>
            <NavItem to="/membership" icon={Users} label="All Members" collapsed={collapsed} />
            <NavItem to="/membership/add" icon={UserPlus} label="Add Member" collapsed={collapsed} />
            <NavItem to="/membership/update" icon={Edit} label="Update Member" collapsed={collapsed} />
          </NavGroup>
        )}

        {/* Admin */}
        {isAdmin && (
          <NavGroup title="Admin" collapsed={collapsed}>
            <NavItem to="/users" icon={Users} label="User Management" collapsed={collapsed} />
          </NavGroup>
        )}

        {/* Reports */}
        <NavGroup title="Reports" collapsed={collapsed}>
          <NavItem to="/reports" icon={FileText} label="View Reports" collapsed={collapsed} />
        </NavGroup>
      </nav>
    </aside>
  );
}
