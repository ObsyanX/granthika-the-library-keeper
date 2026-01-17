import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  RefreshCw, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  PlusCircle,
  Settings,
  BarChart3,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  badge?: number;
}

function NavItem({ to, icon: Icon, label, collapsed, badge }: NavItemProps) {
  const content = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group',
          'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground',
          collapsed && 'justify-center px-2'
        )
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="font-medium text-sm">{label}</span>}
      {badge && badge > 0 && (
        <span className={cn(
          "absolute bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center",
          collapsed ? "top-0 right-0" : "ml-auto"
        )}>
          {badge}
        </span>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
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
        <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
      )}
      {collapsed && <div className="h-px bg-border mx-2 my-2" />}
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
        'hidden md:flex flex-col bg-card/50 backdrop-blur-sm border-r border-border h-[calc(100vh-64px)] sticky top-16 transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-background border border-border text-muted-foreground flex items-center justify-center shadow-sm hover:bg-accent hover:text-foreground transition-colors z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto scrollbar-thin">
        {/* Overview */}
        <NavGroup title="Overview" collapsed={collapsed}>
          <NavItem to={isAdmin ? "/admin" : "/user"} icon={Home} label="Dashboard" collapsed={collapsed} />
          <NavItem to="/books" icon={BookOpen} label={isAdmin ? "Catalog" : "Books"} collapsed={collapsed} />
        </NavGroup>

        {/* Transactions */}
        <NavGroup title="Transactions" collapsed={collapsed}>
          <NavItem to="/transactions" icon={RefreshCw} label={isAdmin ? "All Transactions" : "My Transactions"} collapsed={collapsed} />
          <NavItem to="/transactions/issue" icon={PlusCircle} label={isAdmin ? "Issue Book" : "Borrow Book"} collapsed={collapsed} />
          <NavItem to="/transactions/return" icon={RefreshCw} label="Return Book" collapsed={collapsed} />
          <NavItem to="/transactions/fine" icon={CreditCard} label={isAdmin ? "Record Fine" : "Pay Fine"} collapsed={collapsed} />
        </NavGroup>

        {/* Membership (Admin Only) */}
        {isAdmin && (
          <NavGroup title="Members" collapsed={collapsed}>
            <NavItem to="/membership" icon={Users} label="All Members" collapsed={collapsed} />
            <NavItem to="/membership/add" icon={UserPlus} label="Add Member" collapsed={collapsed} />
          </NavGroup>
        )}

        {/* Admin Only */}
        {isAdmin && (
          <NavGroup title="Administration" collapsed={collapsed}>
            <NavItem to="/books/add" icon={PlusCircle} label="Add Book" collapsed={collapsed} />
            <NavItem to="/users" icon={Users} label="User Accounts" collapsed={collapsed} />
            <NavItem to="/admin/settings" icon={Settings} label="Settings" collapsed={collapsed} />
          </NavGroup>
        )}

        {/* Reports */}
        <NavGroup title="Reports" collapsed={collapsed}>
          <NavItem to="/reports" icon={BarChart3} label={isAdmin ? "All Reports" : "My Reports"} collapsed={collapsed} />
        </NavGroup>

        {/* Account (User Only) */}
        {!isAdmin && (
          <NavGroup title="Account" collapsed={collapsed}>
            <NavItem to="/profile" icon={User} label="Profile" collapsed={collapsed} />
          </NavGroup>
        )}
      </nav>
    </aside>
  );
}
