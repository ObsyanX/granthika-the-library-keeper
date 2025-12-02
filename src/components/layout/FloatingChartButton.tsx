import { useState } from 'react';
import { LayoutGrid, X, Home, Users, BookOpen, RefreshCw, FileText, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function FloatingChartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const adminLinks = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'User Management', path: '/users' },
    { icon: BookOpen, label: 'Books', path: '/books' },
    { icon: Settings, label: 'Membership', path: '/membership' },
    { icon: RefreshCw, label: 'Transactions', path: '/transactions' },
    { icon: FileText, label: 'Reports', path: '/reports' },
  ];

  const userLinks = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: RefreshCw, label: 'Transactions', path: '/transactions' },
    { icon: FileText, label: 'Reports', path: '/reports' },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
          <div className="glass-card rounded-2xl p-4 min-w-[200px]">
            <h3 className="font-display text-lg font-semibold mb-3 text-foreground">Navigation</h3>
            <div className="space-y-2">
              {links.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavigate(link.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-left text-foreground"
                >
                  <link.icon className="w-5 h-5 text-primary" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Navigation menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <LayoutGrid className="w-6 h-6" />}
      </button>
    </>
  );
}
