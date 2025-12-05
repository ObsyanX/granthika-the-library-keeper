import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, RefreshCw, BarChart3, Film, Clock, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useBooks } from '@/hooks/useBooks';
import { useMembers, Member } from '@/hooks/useMembers';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type TabType = 'reports' | 'transactions';

const categoryCodeRanges = [
  { category: 'Science', code: 'SC', bookRange: 'SCB001 - SCB999', movieRange: 'SCM001 - SCM999' },
  { category: 'Economics', code: 'EC', bookRange: 'ECB001 - ECB999', movieRange: 'ECM001 - ECM999' },
  { category: 'Fiction', code: 'FC', bookRange: 'FCB001 - FCB999', movieRange: 'FCM001 - FCM999' },
  { category: 'Children', code: 'CH', bookRange: 'CHB001 - CHB999', movieRange: 'CHM001 - CHM999' },
  { category: 'Personal Development', code: 'PD', bookRange: 'PDB001 - PDB999', movieRange: 'PDM001 - PDM999' },
];

export default function UserHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('transactions');
  const { books } = useBooks();
  const { members } = useMembers();
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const [userMember, setUserMember] = useState<Member | null>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserMember = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data) {
          setUserMember(data as Member);
          // Fetch user's transactions
          const { data: txns } = await supabase
            .from('transactions')
            .select('*, books(*)')
            .eq('member_id', data.id)
            .order('created_at', { ascending: false });
          
          setUserTransactions(txns || []);
        }
      }
    };
    fetchUserMember();
  }, [user]);

  const tabs = [
    { id: 'transactions' as const, label: 'My Transactions', icon: RefreshCw },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
  ];

  const reportActions = [
    { label: 'Available Books', icon: BookOpen, path: '/reports?tab=available', color: 'gradient-primary' },
    { label: 'Available Movies', icon: Film, path: '/reports?tab=movies', color: 'bg-secondary' },
  ];

  const myIssuedBooks = userTransactions.filter(t => t.status === 'issued');
  const myOverdueBooks = userTransactions.filter(t => t.status === 'overdue');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Welcome, {userMember?.name || user?.user_metadata?.name || 'User'}
            </h1>
            <p className="text-muted-foreground">
              {userMember 
                ? `Membership: ${userMember.membership_no} • Valid until ${userMember.end_date}`
                : 'No membership linked to your account'}
            </p>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary">
              {myIssuedBooks.length} Books Borrowed
            </span>
            {myOverdueBooks.length > 0 && (
              <span className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive">
                {myOverdueBooks.length} Overdue
              </span>
            )}
          </div>
        </div>

        {/* No Membership Warning */}
        {!userMember && (
          <div className="neu-card bg-secondary/10 border border-secondary/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-10 h-10 text-secondary" />
              <div>
                <h3 className="font-semibold text-foreground">No Membership Found</h3>
                <p className="text-muted-foreground text-sm">
                  Your account is not linked to a library membership. Please contact the librarian to link your membership.
                </p>
              </div>
            </div>
          </div>
        )}

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
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">My Borrowed Books</h2>
                {userMember && (
                  <Button 
                    onClick={() => navigate('/transactions/issue')}
                    className="gradient-primary text-primary-foreground rounded-xl"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Borrow Book
                  </Button>
                )}
              </div>

              {myIssuedBooks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Book</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Issue Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Due Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myIssuedBooks.map((t) => (
                        <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <p className="font-medium text-foreground">{t.books?.title}</p>
                            <p className="text-sm text-muted-foreground">{t.books?.serial_no}</p>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{t.issue_date}</td>
                          <td className="py-3 px-4 text-muted-foreground">{t.due_date}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              t.status === 'overdue' 
                                ? 'bg-destructive/10 text-destructive' 
                                : 'bg-accent text-accent-foreground'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>You haven't borrowed any books yet</p>
                </div>
              )}

              {/* Overdue Warning */}
              {myOverdueBooks.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                    <Clock className="w-4 h-4" />
                    Overdue Books
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have {myOverdueBooks.length} overdue book(s). Please return them to avoid additional fines.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-foreground">View Available Items</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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