import { BookOpen, Users, CreditCard, RefreshCw, FileText, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useBooks } from '@/hooks/useBooks';
import { useMembers } from '@/hooks/useMembers';
import { useTransactions } from '@/hooks/useTransactions';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  color: 'primary' | 'secondary' | 'accent' | 'destructive';
  onClick?: () => void;
}

function StatCard({ icon: Icon, label, value, trend, color, onClick }: StatCardProps) {
  const iconBgClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/20 text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <button
      onClick={onClick}
      className="neu-card bg-card rounded-2xl p-6 text-left w-full group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-sm text-accent-foreground bg-accent px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold font-display text-foreground mb-1">{value}</p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </button>
  );
}

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
}

function QuickAction({ icon: Icon, label, description, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="neu-card bg-card rounded-2xl p-5 text-left w-full flex items-center gap-4 group"
    >
      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { books, availableBooks, loading: booksLoading } = useBooks();
  const { activeMembers, loading: membersLoading } = useMembers();
  const { transactions, issuedTransactions, overdueTransactions, loading: transactionsLoading } = useTransactions();

  const loading = booksLoading || membersLoading || transactionsLoading;

  const totalBooks = books.length;
  const totalAvailableCopies = books.reduce((sum, book) => sum + book.available_copies, 0);
  const activeMembersCount = activeMembers.length;
  const overdueCount = overdueTransactions.length;

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Namaste, {userName}! 🙏
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            label="Total Books"
            value={totalBooks}
            color="primary"
            onClick={() => navigate('/books')}
          />
          <StatCard
            icon={CheckCircle}
            label="Available Copies"
            value={totalAvailableCopies}
            color="accent"
            onClick={() => navigate('/reports')}
          />
          <StatCard
            icon={Users}
            label="Active Members"
            value={activeMembersCount}
            color="secondary"
            onClick={() => navigate('/membership')}
          />
          <StatCard
            icon={AlertTriangle}
            label="Overdue"
            value={overdueCount}
            color="destructive"
            onClick={() => navigate('/reports')}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickAction
              icon={BookOpen}
              label="Issue Book"
              description="Issue a book to a member"
              onClick={() => navigate('/transactions/issue')}
            />
            <QuickAction
              icon={RefreshCw}
              label="Return Book"
              description="Process book returns"
              onClick={() => navigate('/transactions/return')}
            />
            <QuickAction
              icon={FileText}
              label="View Reports"
              description="Access detailed reports"
              onClick={() => navigate('/reports')}
            />
            <QuickAction
              icon={BookOpen}
              label="Add Book"
              description="Add new book to catalog"
              onClick={() => navigate('/books/add')}
            />
            <QuickAction
              icon={Users}
              label="Add Member"
              description="Register new membership"
              onClick={() => navigate('/membership/add')}
            />
            <QuickAction
              icon={CreditCard}
              label="Pay Fine"
              description="Process fine payments"
              onClick={() => navigate('/transactions/fine')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Recent Transactions</h2>
          <div className="neu-card bg-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Book</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Issue Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-medium text-foreground">{transaction.book?.title || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{transaction.book?.author || ''}</p>
                      </td>
                      <td className="py-4 px-6 text-foreground">{transaction.member?.name || 'Unknown'}</td>
                      <td className="py-4 px-6 text-muted-foreground">{transaction.issue_date}</td>
                      <td className="py-4 px-6 text-muted-foreground">{transaction.due_date}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'issued' ? 'bg-primary/10 text-primary' :
                          transaction.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                          'bg-accent text-accent-foreground'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No transactions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
