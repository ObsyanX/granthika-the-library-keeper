import { Moon, Sun, LogOut, BookOpen } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const homeLink = isAdmin ? '/admin' : '/user';

  return (
    <header className="glass-card sticky top-0 z-30 border-b border-border/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={homeLink} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Granthikaḥ</h1>
            <p className="text-xs text-muted-foreground">ग्रन्थिकः • The Keeper of Books</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-accent/50 text-sm">
              <span className="font-medium text-foreground">{userName}</span>
              {isAdmin && (
                <Badge variant="secondary" className="text-xs">Admin</Badge>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
