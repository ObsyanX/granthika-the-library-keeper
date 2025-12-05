import { BookOpen, RefreshCw, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

interface TransactionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

function TransactionCard({ icon: Icon, title, description, onClick }: TransactionCardProps) {
  return (
    <button
      onClick={onClick}
      className="neu-card bg-card rounded-2xl p-8 text-left w-full group"
    >
      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8 text-primary-foreground" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </button>
  );
}

export default function Transactions() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Manage book issues, returns, and fines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TransactionCard
            icon={BookOpen}
            title="Issue Book"
            description="Issue a book to a library member with return date tracking"
            onClick={() => navigate('/transactions/issue')}
          />
          <TransactionCard
            icon={RefreshCw}
            title="Return Book"
            description="Process book returns and calculate any applicable fines"
            onClick={() => navigate('/transactions/return')}
          />
          {isAdmin && (
            <TransactionCard
              icon={CreditCard}
              title="Record Fine Payment"
              description="Process and record fine payments from members"
              onClick={() => navigate('/transactions/fine')}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
