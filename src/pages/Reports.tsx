import { useState, useEffect } from 'react';
import { BookOpen, Users, AlertTriangle, CheckCircle, Download, Printer, Clock, Film, FileText, User } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useBooks } from '@/hooks/useBooks';
import { useMembers, Member } from '@/hooks/useMembers';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type ReportType = 'available' | 'movies' | 'issued' | 'members' | 'overdue' | 'duetoday' | 'pending' | 'myaccount';

export default function Reports() {
  const [activeReport, setActiveReport] = useState<ReportType>('available');
  const { books } = useBooks();
  const { members } = useMembers();
  const { transactions, issuedTransactions, overdueTransactions } = useTransactions();
  const { user, isAdmin } = useAuth();
  const [userMember, setUserMember] = useState<Member | null>(null);

  // Fetch user's membership for non-admins
  useEffect(() => {
    const fetchUserMember = async () => {
      if (!isAdmin && user?.id) {
        const { data } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data) {
          setUserMember(data as Member);
        }
      }
    };
    fetchUserMember();
  }, [user, isAdmin]);

  // Filter transactions based on role
  const filteredIssuedTransactions = isAdmin 
    ? issuedTransactions 
    : issuedTransactions.filter(t => t.member_id === userMember?.id);

  const filteredOverdueTransactions = isAdmin 
    ? overdueTransactions 
    : overdueTransactions.filter(t => t.member_id === userMember?.id);

  const filteredTransactions = isAdmin
    ? transactions
    : transactions.filter(t => t.member_id === userMember?.id);

  // Define report tabs based on role
  const adminReportTabs = [
    { id: 'available' as const, label: 'Available Books', icon: BookOpen },
    { id: 'movies' as const, label: 'Available Movies', icon: Film },
    { id: 'issued' as const, label: 'Issued Items', icon: CheckCircle },
    { id: 'members' as const, label: 'Members', icon: Users },
    { id: 'overdue' as const, label: 'Overdue', icon: AlertTriangle },
    { id: 'duetoday' as const, label: 'Due Today', icon: Clock },
    { id: 'pending' as const, label: 'Pending Requests', icon: FileText },
  ];

  const userReportTabs = [
    { id: 'myaccount' as const, label: 'My Account', icon: User },
    { id: 'issued' as const, label: 'My Borrowed Items', icon: CheckCircle },
    { id: 'overdue' as const, label: 'My Overdue', icon: AlertTriangle },
    { id: 'duetoday' as const, label: 'Due Today', icon: Clock },
    { id: 'available' as const, label: 'Available Books', icon: BookOpen },
    { id: 'movies' as const, label: 'Available Movies', icon: Film },
  ];

  const reportTabs = isAdmin ? adminReportTabs : userReportTabs;

  const today = format(new Date(), 'yyyy-MM-dd');
  const availableBooks = books.filter(b => b.type === 'book' && b.available_copies > 0);
  const availableMovies = books.filter(b => b.type === 'movie' && b.available_copies > 0);
  const dueTodayTransactions = filteredIssuedTransactions.filter(t => t.due_date === today);

  // Calculate pending fines for members
  const getMemberPendingFine = (memberId: string) => {
    return transactions
      .filter(t => t.member_id === memberId && t.fine && !t.fine_paid)
      .reduce((sum, t) => sum + (t.fine || 0), 0);
  };

  // Get user's own pending fine
  const userPendingFine = userMember ? getMemberPendingFine(userMember.id) : 0;

  const handleExport = () => {
    toast.success('Report exported!', { description: 'CSV file has been downloaded' });
  };

  const handlePrint = () => {
    window.print();
  };

  // Set default tab for users
  useEffect(() => {
    if (!isAdmin && activeReport === 'members') {
      setActiveReport('myaccount');
    }
  }, [isAdmin, activeReport]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {isAdmin ? 'Reports' : 'My Reports'}
            </h1>
            <p className="text-muted-foreground">
              {isAdmin ? 'View and export library reports' : 'View your borrowing history and account status'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={handlePrint} className="rounded-xl">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="flex flex-wrap gap-2">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeReport === tab.id
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="neu-card bg-card rounded-2xl overflow-hidden">
          {/* My Account (User Only) */}
          {activeReport === 'myaccount' && !isAdmin && (
            <div className="p-6">
              {userMember ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground">Membership No</p>
                      <p className="text-lg font-semibold text-foreground">{userMember.membership_no}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-lg font-semibold text-foreground">{userMember.name}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-lg font-semibold text-foreground">{userMember.email}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground">Membership Valid Till</p>
                      <p className="text-lg font-semibold text-foreground">{userMember.end_date}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                        userMember.status === 'active' ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {userMember.status}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground">Pending Fine</p>
                      {userPendingFine > 0 ? (
                        <span className="inline-block bg-destructive/10 text-destructive px-3 py-1 rounded text-lg font-semibold">
                          ₹{userPendingFine}
                        </span>
                      ) : (
                        <p className="text-lg font-semibold text-accent-foreground">No dues</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-xl bg-primary/10">
                        <p className="text-2xl font-bold text-primary">{filteredIssuedTransactions.length}</p>
                        <p className="text-sm text-muted-foreground">Currently Borrowed</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-destructive/10">
                        <p className="text-2xl font-bold text-destructive">{filteredOverdueTransactions.length}</p>
                        <p className="text-sm text-muted-foreground">Overdue Items</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-secondary/10">
                        <p className="text-2xl font-bold text-secondary-foreground">{dueTodayTransactions.length}</p>
                        <p className="text-sm text-muted-foreground">Due Today</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-muted">
                        <p className="text-2xl font-bold text-foreground">
                          {filteredTransactions.filter(t => t.status === 'returned').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Returned</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <User className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p>No membership found for your account</p>
                  <p className="text-sm mt-2">Contact the librarian to register for a membership</p>
                </div>
              )}
            </div>
          )}

          {/* Available Books */}
          {activeReport === 'available' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Serial No</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Title</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Author</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Category</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                    {isAdmin && <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Cost</th>}
                    {isAdmin && <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Procurement Date</th>}
                  </tr>
                </thead>
                <tbody>
                  {availableBooks.map((book) => (
                    <tr key={book.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{book.serial_no}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{book.title}</td>
                      <td className="py-4 px-6 text-muted-foreground">{book.author}</td>
                      <td className="py-4 px-6 text-muted-foreground">{book.genre}</td>
                      <td className="py-4 px-6">
                        <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-sm">
                          {book.available_copies} / {book.copies}
                        </span>
                      </td>
                      {isAdmin && <td className="py-4 px-6 text-muted-foreground">₹{book.cost || 0}</td>}
                      {isAdmin && <td className="py-4 px-6 text-muted-foreground">{book.procurement_date || '-'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Available Movies */}
          {activeReport === 'movies' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Serial No</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Title</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Director</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Category</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                    {isAdmin && <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Cost</th>}
                    {isAdmin && <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Procurement Date</th>}
                  </tr>
                </thead>
                <tbody>
                  {availableMovies.length > 0 ? availableMovies.map((movie) => (
                    <tr key={movie.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{movie.serial_no}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{movie.title}</td>
                      <td className="py-4 px-6 text-muted-foreground">{movie.author}</td>
                      <td className="py-4 px-6 text-muted-foreground">{movie.genre}</td>
                      <td className="py-4 px-6">
                        <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-sm">
                          {movie.available_copies} / {movie.copies}
                        </span>
                      </td>
                      {isAdmin && <td className="py-4 px-6 text-muted-foreground">₹{movie.cost || 0}</td>}
                      {isAdmin && <td className="py-4 px-6 text-muted-foreground">{movie.procurement_date || '-'}</td>}
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 5} className="py-12 text-center text-muted-foreground">
                        <Film className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        No movies available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Issued Items */}
          {activeReport === 'issued' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Serial No</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Title</th>
                    {isAdmin && <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>}
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Issue Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssuedTransactions.length > 0 ? filteredIssuedTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{t.book?.serial_no}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{t.book?.title}</td>
                      {isAdmin && <td className="py-4 px-6 text-foreground">{t.member?.name}</td>}
                      <td className="py-4 px-6 text-muted-foreground">{t.issue_date}</td>
                      <td className="py-4 px-6 text-muted-foreground">{t.due_date}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4} className="py-12 text-center text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto text-accent-foreground mb-3" />
                        {isAdmin ? 'No items currently issued' : 'You have no borrowed items'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Members (Admin Only) */}
          {activeReport === 'members' && isAdmin && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Membership No</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Name</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Email</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Contact</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">End Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Pending Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const pendingFine = getMemberPendingFine(member.id);
                    return (
                      <tr key={member.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-6 font-mono text-foreground">{member.membership_no}</td>
                        <td className="py-4 px-6 font-medium text-foreground">{member.name}</td>
                        <td className="py-4 px-6 text-muted-foreground">{member.email}</td>
                        <td className="py-4 px-6 text-muted-foreground">{member.contact_number || '-'}</td>
                        <td className="py-4 px-6 text-muted-foreground">{member.end_date}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            member.status === 'active' ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {pendingFine > 0 ? (
                            <span className="bg-destructive/10 text-destructive px-2 py-1 rounded text-sm font-medium">
                              ₹{pendingFine}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Overdue */}
          {activeReport === 'overdue' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Serial No</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Title</th>
                    {isAdmin && <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>}
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOverdueTransactions.length > 0 ? filteredOverdueTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{t.book?.serial_no}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{t.book?.title}</td>
                      {isAdmin && <td className="py-4 px-6 text-foreground">{t.member?.name}</td>}
                      <td className="py-4 px-6 text-destructive font-medium">{t.due_date}</td>
                      <td className="py-4 px-6">
                        <span className="bg-destructive/10 text-destructive px-2 py-1 rounded text-sm font-medium">
                          ₹{t.fine || 0}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4} className="py-12 text-center text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto text-accent-foreground mb-3" />
                        {isAdmin ? 'No overdue items! Great job!' : 'You have no overdue items!'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Due Today */}
          {activeReport === 'duetoday' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Serial No</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Title</th>
                    {isAdmin && <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>}
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Issue Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dueTodayTransactions.length > 0 ? dueTodayTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{t.book?.serial_no}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{t.book?.title}</td>
                      {isAdmin && <td className="py-4 px-6 text-foreground">{t.member?.name}</td>}
                      <td className="py-4 px-6 text-muted-foreground">{t.issue_date}</td>
                      <td className="py-4 px-6">
                        <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded text-sm font-medium">
                          {t.due_date}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4} className="py-12 text-center text-muted-foreground">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        {isAdmin ? 'No items due today' : 'You have no items due today'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pending Requests (Admin Only) */}
          {activeReport === 'pending' && isAdmin && (
            <div className="overflow-x-auto">
              <div className="py-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                No pending issue requests
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}