import { ReactNode } from 'react';
import { Header } from './Header';
import { FloatingChartButton } from './FloatingChartButton';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="page-transition">
          {children}
        </div>
      </main>
      <FloatingChartButton />
    </div>
  );
}
