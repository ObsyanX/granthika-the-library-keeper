import { NavLink } from 'react-router-dom';
import { Home, BookOpen, RefreshCw, FileText, Users, Menu, X, Search, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function MobileNav() {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const homeLink = isAdmin ? '/admin' : '/user';

  const navItems = [
    { to: homeLink, icon: Home, label: 'Home' },
    { to: '/books', icon: BookOpen, label: 'Books' },
    { to: '/transactions', icon: RefreshCw, label: 'Transactions' },
    { to: '/reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-50 animate-fade-in">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { to: homeLink, icon: Home, label: 'Home' },
                { to: '/books', icon: BookOpen, label: 'Books Catalog' },
                { to: '/books/add', icon: BookOpen, label: 'Add Book', adminOnly: true },
                { to: '/transactions', icon: RefreshCw, label: 'Transactions' },
                { to: '/transactions/search', icon: Search, label: 'Book Available' },
                { to: '/transactions/issue', icon: BookOpen, label: 'Issue Book' },
                { to: '/transactions/return', icon: RefreshCw, label: 'Return Book' },
                { to: '/transactions/fine', icon: RefreshCw, label: 'Pay Fine', adminOnly: true },
                { to: '/membership', icon: Users, label: 'Memberships', adminOnly: true },
                { to: '/membership/add', icon: Users, label: 'Add Member', adminOnly: true },
                { to: '/membership/update', icon: Edit, label: 'Update Member', adminOnly: true },
                { to: '/users', icon: Users, label: 'User Management', adminOnly: true },
                { to: '/reports', icon: FileText, label: 'Reports' },
              ]
                .filter(item => !item.adminOnly || isAdmin)
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-foreground hover:bg-muted'
                      )
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
