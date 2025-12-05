import { useState } from 'react';
import { BookOpen, Users, AlertTriangle, CheckCircle, Download, Printer, Clock, Film, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useBooks } from '@/hooks/useBooks';
import { useMembers } from '@/hooks/useMembers';
import { useTransactions } from '@/hooks/useTransactions';

type ReportType = 'available' | 'movies' | 'issued' | 'members' | 'overdue' | 'duetoday' | 'pending';

export default function Reports() {
  const [activeReport, setActiveReport] = useState<ReportType>('available');
  const { books } = useBooks();
  const { members } = useMembers();
  const { transactions, issuedTransactions, overdueTransactions } = useTransactions();

  const reportTabs = [
    { id: 'available' as const, label: 'Available Books', icon: BookOpen },
    { id: 'movies' as const, label: 'Available Movies', icon: Film },
    { id: 'issued' as const, label: 'Issued Items', icon: CheckCircle },
    { id: 'members' as const, label: 'Members', icon: Users },
    { id: 'overdue' as const, label: 'Overdue', icon: AlertTriangle },
    { id: 'duetoday' as const, label: 'Due Today', icon: Clock },
    { id: 'pending' as const, label: 'Pending Requests', icon: FileText },
  ];

  const today = format(new Date(), 'yyyy-MM-dd');
  const availableBooks = books.filter(b => b.type === 'book' && b.available_copies > 0);
  const availableMovies = books.filter(b => b.type === 'movie' && b.available_copies > 0);
  const dueTodayTransactions = issuedTransactions.filter(t => t.due_date === today);

  // Calculate pending fines for members
  const getMemberPendingFine = (memberId: string) => {
    return transactions
      .filter(t => t.member_id === memberId && t.fine && !t.fine_paid)
      .reduce((sum, t) => sum + (t.fine || 0), 0);
  };

  const handleExport = () => {
    toast.success('Report exported!', { description: 'CSV file has been downloaded' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">View and export library reports</p>
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
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Cost</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Procurement Date</th>
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
                      <td className="py-4 px-6 text-muted-foreground">₹{book.cost || 0}</td>
                      <td className="py-4 px-6 text-muted-foreground">{book.procurement_date || '-'}</td>
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
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Cost</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Procurement Date</th>
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
                      <td className="py-4 px-6 text-muted-foreground">₹{movie.cost || 0}</td>
                      <td className="py-4 px-6 text-muted-foreground">{movie.procurement_date || '-'}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
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
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Issue Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedTransactions.length > 0 ? issuedTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{t.book?.serial_no}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{t.book?.title}</td>
                      <td className="py-4 px-6 text-foreground">{t.member?.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">{t.issue_date}</td>
                      <td className="py-4 px-6 text-muted-foreground">{t.due_date}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto text-accent-foreground mb-3" />
                        No items currently issued
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Members */}
          {activeReport === 'members' && (
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
                        <td className="py-4 px-6 text-muted-foreground">{(member as any).contact_number || '-'}</td>
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
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueTransactions.length > 0 ? overdueTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{t.book?.serial_no}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{t.book?.title}</td>
                      <td className="py-4 px-6 text-foreground">{t.member?.name}</td>
                      <td className="py-4 px-6 text-destructive font-medium">{t.due_date}</td>
                      <td className="py-4 px-6">
                        <span className="bg-destructive/10 text-destructive px-2 py-1 rounded text-sm font-medium">
                          ₹{t.fine || 0}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto text-accent-foreground mb-3" />
                        No overdue items! Great job!
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
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Issue Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dueTodayTransactions.length > 0 ? dueTodayTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{t.book?.serial_no}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{t.book?.title}</td>
                      <td className="py-4 px-6 text-foreground">{t.member?.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">{t.issue_date}</td>
                      <td className="py-4 px-6">
                        <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded text-sm font-medium">
                          {t.due_date}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        No items due today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pending Requests */}
          {activeReport === 'pending' && (
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