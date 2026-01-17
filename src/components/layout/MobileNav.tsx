import { NavLink } from 'react-router-dom';
import { Home, BookOpen, RefreshCw, Users, Menu, CreditCard, PlusCircle, Settings, BarChart3, UserPlus, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function MobileNav() {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const homeLink = isAdmin ? '/admin' : '/user';

  const primaryNavItems = [
    { to: homeLink, icon: Home, label: 'Home' },
    { to: '/books', icon: BookOpen, label: 'Books' },
    { to: '/transactions', icon: RefreshCw, label: 'Actions' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  const transactionItems = [
    { to: '/transactions', icon: RefreshCw, label: isAdmin ? 'All Transactions' : 'My Transactions' },
    { to: '/transactions/issue', icon: PlusCircle, label: isAdmin ? 'Issue Book' : 'Borrow Book' },
    { to: '/transactions/return', icon: RefreshCw, label: 'Return Book' },
    { to: '/transactions/fine', icon: CreditCard, label: isAdmin ? 'Record Fine' : 'Pay Fine' },
  ];

  const memberItems = isAdmin ? [
    { to: '/membership', icon: Users, label: 'All Members' },
    { to: '/membership/add', icon: UserPlus, label: 'Add Member' },
  ] : [];

  const adminItems = isAdmin ? [
    { to: '/books/add', icon: PlusCircle, label: 'Add Book' },
    { to: '/users', icon: Users, label: 'User Accounts' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ] : [];

  const accountItems = !isAdmin ? [
    { to: '/profile', icon: User, label: 'Profile' },
  ] : [];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px]',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-muted-foreground min-w-[64px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
                <span className="text-[11px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-[20px] px-0">
              <SheetHeader className="px-6 pb-4">
                <SheetTitle className="text-left font-display text-xl">Menu</SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="h-full px-6 pb-8">
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Quick Actions
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <NavLink
                        to="/transactions/issue"
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <PlusCircle className="w-6 h-6" />
                        <span className="text-sm font-medium">{isAdmin ? 'Issue Book' : 'Borrow Book'}</span>
                      </NavLink>
                      <NavLink
                        to="/transactions/return"
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                      >
                        <RefreshCw className="w-6 h-6" />
                        <span className="text-sm font-medium">Return Book</span>
                      </NavLink>
                    </div>
                  </div>

                  <Separator />

                  {/* Transactions */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Transactions
                    </p>
                    <div className="space-y-1">
                      {transactionItems.map((item) => (
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

                  {/* Members (Admin Only) */}
                  {memberItems.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Members
                        </p>
                        <div className="space-y-1">
                          {memberItems.map((item) => (
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
                    </>
                  )}

                  {/* Admin (Admin Only) */}
                  {adminItems.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Administration
                        </p>
                        <div className="space-y-1">
                          {adminItems.map((item) => (
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
                    </>
                  )}

                  {/* Account (User Only) */}
                  {accountItems.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Account
                        </p>
                        <div className="space-y-1">
                          {accountItems.map((item) => (
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
                    </>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
