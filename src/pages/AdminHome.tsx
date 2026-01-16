import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileText, Settings, Plus, RefreshCw, CreditCard, BarChart3, Film, AlertTriangle, TrendingUp, ArrowRight, Clock, Package } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBooks } from '@/hooks/useBooks';
import { useMembers } from '@/hooks/useMembers';
import { useTransactions } from '@/hooks/useTransactions';
import { format } from 'date-fns';
import { StatsGridSkeleton } from '@/components/skeletons';

const categoryCodeRanges = [
  { category: 'Science', code: 'SC', bookRange: 'SCB001 - SCB999', movieRange: 'SCM001 - SCM999' },
  { category: 'Economics', code: 'EC', bookRange: 'ECB001 - ECB999', movieRange: 'ECM001 - ECM999' },
  { category: 'Fiction', code: 'FC', bookRange: 'FCB001 - FCB999', movieRange: 'FCM001 - FCM999' },
  { category: 'Children', code: 'CH', bookRange: 'CHB001 - CHB999', movieRange: 'CHM001 - CHM999' },
  { category: 'Personal Development', code: 'PD', bookRange: 'PDB001 - PDB999', movieRange: 'PDM001 - PDM999' },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const { books, loading: booksLoading } = useBooks();
  const { members, activeMembers, loading: membersLoading } = useMembers();
  const { transactions, issuedTransactions, overdueTransactions, loading: transactionsLoading } = useTransactions();

  const isLoading = booksLoading || membersLoading || transactionsLoading;

  const today = format(new Date(), 'yyyy-MM-dd');
  const dueTodayCount = issuedTransactions.filter(t => t.due_date === today).length;
  const availableItems = books.filter(b => b.available_copies > 0).length;
  const totalCopies = books.reduce((sum, b) => sum + b.copies, 0);
  const borrowedCopies = books.reduce((sum, b) => sum + (b.copies - b.available_copies), 0);

  const quickActions = [
    { label: 'Issue Book', icon: BookOpen, path: '/transactions/issue', color: 'gradient-primary', description: 'Lend a book to member' },
    { label: 'Return Book', icon: RefreshCw, path: '/transactions/return', color: 'bg-accent', description: 'Process book return' },
    { label: 'Add Item', icon: Plus, path: '/books/add', color: 'bg-secondary', description: 'Add book or movie' },
    { label: 'Add Member', icon: Users, path: '/membership/add', color: 'bg-muted', description: 'Register new member' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <section className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your library operations and view key metrics
          </p>
        </section>

        {/* Key Metrics */}
        {isLoading ? (
          <StatsGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Catalog</p>
                    <p className="text-2xl font-bold text-foreground">{books.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">{totalCopies} total copies</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Members</p>
                    <p className="text-2xl font-bold text-foreground">{activeMembers.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">{members.length} total</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Currently Issued</p>
                    <p className="text-2xl font-bold text-foreground">{issuedTransactions.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">{borrowedCopies} copies out</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-border/50 ${overdueTransactions.length > 0 ? 'border-destructive/50 bg-destructive/5' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overdue Items</p>
                    <p className={`text-2xl font-bold ${overdueTransactions.length > 0 ? 'text-destructive' : 'text-foreground'}`}>
                      {overdueTransactions.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{dueTodayCount} due today</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    overdueTransactions.length > 0 ? 'bg-destructive/10' : 'bg-muted'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${overdueTransactions.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Button 
                key={action.label}
                variant="outline" 
                className="h-auto py-5 px-4 flex-col gap-2 rounded-xl hover:bg-primary/5 hover:border-primary/50 group"
                onClick={() => navigate(action.path)}
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <action.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground">{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </Button>
            ))}
          </div>
        </section>

        {/* Management Sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Reports Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Reports & Analytics
              </CardTitle>
              <CardDescription>View library performance and statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-xl h-12"
                onClick={() => navigate('/reports?tab=available')}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Available Books Report
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-xl h-12"
                onClick={() => navigate('/reports?tab=members')}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Members Report
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-xl h-12"
                onClick={() => navigate('/reports?tab=overdue')}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Overdue Report
                </span>
                <Badge variant="destructive" className="ml-2">{overdueTransactions.length}</Badge>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-xl h-12"
                onClick={() => navigate('/reports?tab=pending')}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Pending Requests
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Maintenance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Library Maintenance
              </CardTitle>
              <CardDescription>Manage catalog and memberships</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-xl h-12"
                onClick={() => navigate('/books')}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Manage Catalog
                </span>
                <Badge variant="secondary">{books.length} items</Badge>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-xl h-12"
                onClick={() => navigate('/membership')}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Manage Members
                </span>
                <Badge variant="secondary">{members.length} members</Badge>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-xl h-12"
                onClick={() => navigate('/users')}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  User Accounts
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-xl h-12"
                onClick={() => navigate('/admin/settings')}
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Library Settings
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Category Reference */}
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
