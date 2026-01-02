import { BookOpen, RefreshCw, CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Transactions() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const actions = [
    {
      icon: BookOpen,
      title: 'Borrow a Book',
      description: 'Search for available books and check them out',
      path: '/transactions/issue',
      color: 'gradient-primary',
    },
    {
      icon: RefreshCw,
      title: 'Return a Book',
      description: 'Return borrowed items and check for any fines',
      path: '/transactions/return',
      color: 'bg-accent',
    },
    {
      icon: CreditCard,
      title: isAdmin ? 'Record Fine Payment' : 'Pay My Fines',
      description: isAdmin 
        ? 'Process and record fine payments from members' 
        : 'View and pay any pending fines on your account',
      path: '/transactions/fine',
      color: 'bg-secondary',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <section className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">
            Manage book borrowing, returns, and fine payments
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Card 
              key={action.path}
              className="group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200"
              onClick={() => navigate(action.path)}
            >
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                  <action.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {action.title}
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
