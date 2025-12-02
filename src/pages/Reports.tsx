import { useState } from 'react';
import { BookOpen, Users, AlertTriangle, CheckCircle, Download, Printer, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { mockBooks, mockMembers, mockTransactions } from '@/lib/mockData';

type ReportType = 'available' | 'issued' | 'members' | 'overdue' | 'duetoday';

export default function Reports() {
  const [activeReport, setActiveReport] = useState<ReportType>('available');

  const reportTabs = [
    { id: 'available' as const, label: 'Available Books', icon: BookOpen },
    { id: 'issued' as const, label: 'Issued Books', icon: CheckCircle },
    { id: 'members' as const, label: 'Members', icon: Users },
    { id: 'overdue' as const, label: 'Overdue Books', icon: AlertTriangle },
    { id: 'duetoday' as const, label: 'Due Today', icon: Clock },
  ];

  const today = format(new Date(), 'yyyy-MM-dd');
  const availableBooks = mockBooks.filter(b => b.availableCopies > 0);
  const issuedTransactions = mockTransactions.filter(t => t.status === 'issued');
  const overdueTransactions = mockTransactions.filter(t => t.status === 'overdue');
  const dueTodayTransactions = mockTransactions.filter(t => t.dueDate === today && t.status !== 'returned');

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
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Genre</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {availableBooks.map((book) => (
                    <tr key={book.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{book.serialNo}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{book.title}</td>
                      <td className="py-4 px-6 text-muted-foreground">{book.author}</td>
                      <td className="py-4 px-6 text-muted-foreground">{book.genre}</td>
                      <td className="py-4 px-6">
                        <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-sm">
                          {book.availableCopies} / {book.copies}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Issued Books */}
          {activeReport === 'issued' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Book</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Issue Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-medium text-foreground">{t.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">{t.serialNo}</p>
                      </td>
                      <td className="py-4 px-6 text-foreground">{t.memberName}</td>
                      <td className="py-4 px-6 text-muted-foreground">{t.issueDate}</td>
                      <td className="py-4 px-6 text-muted-foreground">{t.dueDate}</td>
                    </tr>
                  ))}
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
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">End Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMembers.map((member) => (
                    <tr key={member.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-foreground">{member.membershipNo}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{member.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">{member.email}</td>
                      <td className="py-4 px-6 text-muted-foreground">{member.endDate}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          member.status === 'active' ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Overdue Books */}
          {activeReport === 'overdue' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Book</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueTransactions.length > 0 ? overdueTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-medium text-foreground">{t.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">{t.serialNo}</p>
                      </td>
                      <td className="py-4 px-6 text-foreground">{t.memberName}</td>
                      <td className="py-4 px-6 text-destructive font-medium">{t.dueDate}</td>
                      <td className="py-4 px-6">
                        <span className="bg-destructive/10 text-destructive px-2 py-1 rounded text-sm font-medium">
                          ₹{t.fine || 0}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto text-accent-foreground mb-3" />
                        No overdue books! Great job!
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
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Book</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Issue Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dueTodayTransactions.length > 0 ? dueTodayTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-medium text-foreground">{t.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">{t.serialNo}</p>
                      </td>
                      <td className="py-4 px-6 text-foreground">{t.memberName}</td>
                      <td className="py-4 px-6 text-muted-foreground">{t.issueDate}</td>
                      <td className="py-4 px-6">
                        <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded text-sm font-medium">
                          {t.dueDate}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted-foreground">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        No books due today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
