import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, RefreshCw, BarChart3, Film, Clock, AlertTriangle, Calendar, ArrowRight, CreditCard, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/hooks/useMembers';
import { format } from 'date-fns';

const categoryCodeRanges = [
  { category: 'Science', code: 'SC', bookRange: 'SCB001 - SCB999', movieRange: 'SCM001 - SCM999' },
  { category: 'Economics', code: 'EC', bookRange: 'ECB001 - ECB999', movieRange: 'ECM001 - ECM999' },
  { category: 'Fiction', code: 'FC', bookRange: 'FCB001 - FCB999', movieRange: 'FCM001 - FCM999' },
  { category: 'Children', code: 'CH', bookRange: 'CHB001 - CHB999', movieRange: 'CHM001 - CHM999' },
  { category: 'Personal Development', code: 'PD', bookRange: 'PDB001 - PDB999', movieRange: 'PDM001 - PDM999' },
];

interface TransactionWithBook {
  id: string;
  book_id: string;
  member_id: string;
  issue_date: string;
  due_date: string;
  status: string;
  fine: number | null;
  fine_paid: boolean | null;
  books: {
    title: string;
    author: string;
    serial_no: string;
  } | null;
}

export default function UserHome() {
  const navigate = useNavigate();
  const { books } = useBooks();
  const { user } = useAuth();
  const [userMember, setUserMember] = useState<Member | null>(null);
  const [userTransactions, setUserTransactions] = useState<TransactionWithBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        setLoading(true);
        const { data: memberData } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (memberData) {
          setUserMember(memberData as Member);
          const { data: txns } = await supabase
            .from('transactions')
            .select('*, books(*)')
            .eq('member_id', memberData.id)
            .order('created_at', { ascending: false });
          
          setUserTransactions(txns || []);
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const myIssuedBooks = userTransactions.filter(t => t.status === 'issued' || t.status === 'overdue');
  const myOverdueBooks = userTransactions.filter(t => t.status === 'overdue');
  const today = format(new Date(), 'yyyy-MM-dd');
  const dueTodayBooks = myIssuedBooks.filter(t => t.due_date === today);
  const pendingFines = userTransactions
    .filter(t => t.fine && !t.fine_paid)
    .reduce((sum, t) => sum + (t.fine || 0), 0);

  const availableBooks = books.filter(b => b.type === 'book' && b.available_copies > 0).length;
  const availableMovies = books.filter(b => b.type === 'movie' && b.available_copies > 0).length;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <section className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {userMember?.name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Reader'}
          </h1>
          {userMember ? (
            <p className="text-muted-foreground">
              Membership #{userMember.membership_no} • Valid until {format(new Date(userMember.end_date), 'MMM d, yyyy')}
            </p>
          ) : (
            <p className="text-muted-foreground">
              Manage your library account and borrowed items
            </p>
          )}
        </section>

        {/* No Membership Warning */}
        {!loading && !userMember && (
          <Card className="border-secondary bg-secondary/5">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Membership Required</h3>
                <p className="text-sm text-muted-foreground">
                  Your account isn't linked to a library membership yet. Contact the librarian to get started.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {userMember && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{myIssuedBooks.length}</p>
                    <p className="text-xs text-muted-foreground">Borrowed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-border/50 ${myOverdueBooks.length > 0 ? 'border-destructive/50 bg-destructive/5' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    myOverdueBooks.length > 0 ? 'bg-destructive/10' : 'bg-muted'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${myOverdueBooks.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{myOverdueBooks.length}</p>
                    <p className="text-xs text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{dueTodayBooks.length}</p>
                    <p className="text-xs text-muted-foreground">Due Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-border/50 ${pendingFines > 0 ? 'border-destructive/50 bg-destructive/5' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    pendingFines > 0 ? 'bg-destructive/10' : 'bg-accent'
                  }`}>
                    <CreditCard className={`w-5 h-5 ${pendingFines > 0 ? 'text-destructive' : 'text-accent-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">₹{pendingFines}</p>
                    <p className="text-xs text-muted-foreground">Pending Fines</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-auto py-4 px-4 justify-start gap-3 rounded-xl hover:bg-primary/5 hover:border-primary/50"
              onClick={() => navigate('/transactions/issue')}
              disabled={!userMember}
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Borrow Book</p>
                <p className="text-xs text-muted-foreground">Find and borrow items</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto py-4 px-4 justify-start gap-3 rounded-xl hover:bg-accent/50"
              onClick={() => navigate('/transactions/return')}
              disabled={!userMember}
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Return Book</p>
                <p className="text-xs text-muted-foreground">Return borrowed items</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto py-4 px-4 justify-start gap-3 rounded-xl"
              onClick={() => navigate('/books')}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Browse Catalog</p>
                <p className="text-xs text-muted-foreground">{availableBooks} books available</p>
              </div>
            </Button>

            {pendingFines > 0 && (
              <Button 
                variant="outline" 
                className="h-auto py-4 px-4 justify-start gap-3 rounded-xl border-destructive/50 hover:bg-destructive/5"
                onClick={() => navigate('/transactions/fine')}
              >
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Pay Fines</p>
                  <p className="text-xs text-destructive">₹{pendingFines} pending</p>
                </div>
              </Button>
            )}
          </div>
        </section>

        {/* Currently Borrowed */}
        {userMember && myIssuedBooks.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">Currently Borrowed</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/reports?tab=issued')} className="text-primary">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid gap-3">
              {myIssuedBooks.slice(0, 3).map((t) => (
                <Card key={t.id} className={`border-border/50 ${t.status === 'overdue' ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        t.status === 'overdue' ? 'bg-destructive/10' : 'bg-primary/10'
                      }`}>
                        <BookOpen className={`w-6 h-6 ${t.status === 'overdue' ? 'text-destructive' : 'text-primary'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{t.books?.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{t.books?.author}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={t.status === 'overdue' ? 'destructive' : 'outline'} className="mb-1">
                          {t.status === 'overdue' ? 'Overdue' : 'Borrowed'}
                        </Badge>
                        <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <Calendar className="w-3 h-3" />
                          Due {t.due_date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State for No Borrowed Books */}
        {userMember && myIssuedBooks.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No borrowed items</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                You don't have any books checked out. Browse our catalog to find something to read!
              </p>
              <Button onClick={() => navigate('/books')} className="gradient-primary text-primary-foreground rounded-xl">
                Browse Catalog
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Library Info */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Catalog Categories</h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Book Range</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Movie Range</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryCodeRanges.map((row) => (
                    <tr key={row.code} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm text-foreground font-medium">{row.category}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-mono">{row.code}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{row.bookRange}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{row.movieRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
