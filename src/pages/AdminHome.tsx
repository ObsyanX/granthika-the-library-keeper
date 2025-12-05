import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileText, Settings, Plus, RefreshCw, CreditCard, BarChart3, Film } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useBooks } from '@/hooks/useBooks';
import { useMembers } from '@/hooks/useMembers';
import { useTransactions } from '@/hooks/useTransactions';

type TabType = 'maintenance' | 'reports' | 'transactions';

const categoryCodeRanges = [
  { category: 'Science', code: 'SC', bookRange: 'SCB001 - SCB999', movieRange: 'SCM001 - SCM999' },
  { category: 'Economics', code: 'EC', bookRange: 'ECB001 - ECB999', movieRange: 'ECM001 - ECM999' },
  { category: 'Fiction', code: 'FC', bookRange: 'FCB001 - FCB999', movieRange: 'FCM001 - FCM999' },
  { category: 'Children', code: 'CH', bookRange: 'CHB001 - CHB999', movieRange: 'CHM001 - CHM999' },
  { category: 'Personal Development', code: 'PD', bookRange: 'PDB001 - PDB999', movieRange: 'PDM001 - PDM999' },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('maintenance');
  const { books } = useBooks();
  const { members } = useMembers();
  const { transactions, overdueTransactions } = useTransactions();

  const tabs = [
    { id: 'maintenance' as const, label: 'Maintenance', icon: Settings },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
    { id: 'transactions' as const, label: 'Transactions', icon: RefreshCw },
  ];

  const maintenanceActions = [
    { label: 'Add Book/Movie', icon: Plus, path: '/books/add', color: 'gradient-primary' },
    { label: 'Update Book/Movie', icon: RefreshCw, path: '/books', color: 'bg-secondary' },
    { label: 'Add Membership', icon: Users, path: '/membership/add', color: 'gradient-primary' },
    { label: 'Update Membership', icon: RefreshCw, path: '/membership/update', color: 'bg-secondary' },
  ];

  const transactionActions = [
    { label: 'Issue Book', icon: BookOpen, path: '/transactions/issue', color: 'gradient-primary' },
    { label: 'Return Book', icon: RefreshCw, path: '/transactions/return', color: 'bg-secondary' },
    { label: 'Pay Fine', icon: CreditCard, path: '/transactions/fine', color: 'bg-destructive' },
  ];

  const reportActions = [
    { label: 'Books Report', icon: BookOpen, path: '/reports?tab=available', color: 'gradient-primary' },
    { label: 'Movies Report', icon: Film, path: '/reports?tab=movies', color: 'bg-secondary' },
    { label: 'Members Report', icon: Users, path: '/reports?tab=members', color: 'gradient-primary' },
    { label: 'Overdue Report', icon: FileText, path: '/reports?tab=overdue', color: 'bg-destructive' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage library operations</p>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary">
              {books.length} Books/Movies
            </span>
            <span className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary-foreground">
              {members.length} Members
            </span>
            <span className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive">
              {overdueTransactions.length} Overdue
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="neu-card bg-card rounded-2xl p-6">
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Maintenance Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {maintenanceActions.map((action) => (
                  <Button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className={`h-auto py-6 flex flex-col gap-2 rounded-xl ${action.color} text-primary-foreground`}
                  >
                    <action.icon className="w-6 h-6" />
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-foreground">View Reports</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportActions.map((action) => (
                  <Button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className={`h-auto py-6 flex flex-col gap-2 rounded-xl ${action.color} text-primary-foreground`}
                  >
                    <action.icon className="w-6 h-6" />
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Transaction Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {transactionActions.map((action) => (
                  <Button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className={`h-auto py-6 flex flex-col gap-2 rounded-xl ${action.color} text-primary-foreground`}
                  >
                    <action.icon className="w-6 h-6" />
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Details Table */}
        <div className="neu-card bg-card rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Product Code Ranges</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Book Serial Range</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Movie Serial Range</th>
                </tr>
              </thead>
              <tbody>
                {categoryCodeRanges.map((row) => (
                  <tr key={row.code} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground font-medium">{row.category}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{row.code}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{row.bookRange}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{row.movieRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}