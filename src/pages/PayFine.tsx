import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, Search, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useTransactions } from '@/hooks/useTransactions';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/hooks/useMembers';

export default function PayFine() {
  const navigate = useNavigate();
  const location = useLocation();
  const transactionId = (location.state as any)?.transactionId;
  
  const { transactions, updateTransaction } = useTransactions();
  const { updateBook, books } = useBooks();
  const { user, isAdmin } = useAuth();
  const { getDailyFineRate } = useSettings();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(transactionId || null);
  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userMember, setUserMember] = useState<Member | null>(null);

  const dailyFineRate = getDailyFineRate();

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

  // Find selected transaction
  const transaction = selectedTransaction 
    ? transactions.find(t => t.id === selectedTransaction)
    : null;

  // Filter transactions with fines based on role
  const transactionsWithFines = transactions.filter(t => {
    const hasFine = (t.status === 'overdue' || (t.fine && t.fine > 0 && !t.fine_paid));
    const matchesSearch = searchTerm === '' || 
      t.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.book?.serial_no?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For regular users, only show their own fines
    if (!isAdmin && userMember) {
      return hasFine && matchesSearch && t.member_id === userMember.id;
    }
    
    // For admins, show all fines
    return hasFine && matchesSearch;
  });

  // Calculate fine using the admin-set rate
  const calculateFine = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysOverdue = Math.max(0, Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
    return daysOverdue * dailyFineRate;
  };

  const fine = transaction?.fine || (transaction ? calculateFine(transaction.due_date) : 0);

  const handleConfirm = async () => {
    if (!transaction) return;
    
    if (fine > 0 && !finePaid) {
      setError('Please confirm that the fine has been paid');
      return;
    }

    setSubmitting(true);
    try {
      // Update transaction with fine paid
      await updateTransaction(transaction.id, {
        fine,
        fine_paid: true,
        remarks: remarks || transaction.remarks,
      });

      toast.success('Fine payment recorded!', {
        description: `Fine of ₹${fine} has been paid`,
      });
      navigate(isAdmin ? '/transactions' : '/reports');
    } catch (err: any) {
      toast.error('Failed to process payment', { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Show message if user has no membership
  if (!isAdmin && !userMember) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Button variant="ghost" onClick={() => navigate('/reports')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>

          <div className="neu-card bg-card rounded-2xl p-8 text-center">
            <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">No Membership Found</h2>
            <p className="text-muted-foreground mb-6">You need a membership to view and pay fines.</p>
            <Button onClick={() => navigate('/reports')} className="gradient-primary text-primary-foreground rounded-xl">
              Back to Reports
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (transactionsWithFines.length === 0 && !selectedTransaction) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Button variant="ghost" onClick={() => navigate(isAdmin ? '/transactions' : '/reports')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isAdmin ? 'Back to Transactions' : 'Back to Reports'}
          </Button>

          <div className="neu-card bg-card rounded-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-accent-foreground mb-4" />
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">No Fines Pending</h2>
            <p className="text-muted-foreground mb-6">
              {isAdmin ? 'There are no pending fines at this time.' : 'You have no pending fines. Great job!'}
            </p>
            <Button onClick={() => navigate(isAdmin ? '/transactions' : '/reports')} className="gradient-primary text-primary-foreground rounded-xl">
              {isAdmin ? 'Back to Transactions' : 'Back to Reports'}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate(isAdmin ? '/transactions' : '/reports')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isAdmin ? 'Back to Transactions' : 'Back to Reports'}
        </Button>

        <div className="neu-card bg-card rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-secondary flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Pay Fine</h1>
              <p className="text-muted-foreground">
                {isAdmin ? 'Record fine payment' : 'Pay your pending fines'}
              </p>
            </div>
          </div>

          {/* Search / Select Transaction */}
          {!selectedTransaction && (
            <div className="space-y-4 mb-6">
              {isAdmin && (
                <div className="space-y-2">
                  <Label className="text-foreground">Search Transactions with Fines</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by book, member, or serial number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="max-h-64 overflow-y-auto space-y-2 rounded-xl border border-border p-2">
                {transactionsWithFines.map((t) => {
                  const txnFine = t.fine || calculateFine(t.due_date);
                  return (
                    <label
                      key={t.id}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTransaction === t.id ? 'bg-primary/10 border border-primary' : 'hover:bg-muted'
                      }`}
                    >
                      <input
                        type="radio"
                        name="transaction"
                        value={t.id}
                        checked={selectedTransaction === t.id}
                        onChange={() => setSelectedTransaction(t.id)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{t.book?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {isAdmin && `${t.member?.name} • `}Due: {t.due_date}
                        </p>
                      </div>
                      <span className="bg-destructive/10 text-destructive px-2 py-1 rounded text-sm font-medium">
                        ₹{txnFine}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transaction Details */}
          {transaction && (
            <div className="space-y-6">
              {/* Auto-filled Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Book</Label>
                  <Input value={transaction.book?.title || ''} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Serial Number</Label>
                  <Input value={transaction.book?.serial_no || ''} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                {isAdmin && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-foreground">Member</Label>
                      <Input value={transaction.member?.name || ''} disabled className="h-12 rounded-xl bg-muted" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Membership No</Label>
                      <Input value={transaction.member?.membership_no || ''} disabled className="h-12 rounded-xl bg-muted" />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label className="text-foreground">Issue Date</Label>
                  <Input value={transaction.issue_date} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Due Date</Label>
                  <Input value={transaction.due_date} disabled className="h-12 rounded-xl bg-muted" />
                </div>
              </div>

              {/* Fine Amount */}
              <div className={`p-6 rounded-2xl ${fine > 0 ? 'bg-destructive/10 border border-destructive/20' : 'bg-accent border border-accent'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Fine Amount</p>
                    <p className={`text-3xl font-bold font-display ${fine > 0 ? 'text-destructive' : 'text-accent-foreground'}`}>
                      ₹{fine}
                    </p>
                  </div>
                  {fine > 0 && (
                    <p className="text-sm text-muted-foreground">₹{dailyFineRate} per day overdue</p>
                  )}
                </div>
              </div>

              {/* Fine Paid Checkbox */}
              {fine > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="finePaid"
                      checked={finePaid}
                      onCheckedChange={(checked) => {
                        setFinePaid(checked as boolean);
                        setError('');
                      }}
                    />
                    <Label htmlFor="finePaid" className="text-foreground cursor-pointer">
                      {isAdmin 
                        ? `I confirm that the fine of ₹${fine} has been paid`
                        : `I confirm payment of ₹${fine}`
                      }
                    </Label>
                  </div>
                  {error && <p className="text-destructive text-sm">{error}</p>}
                </div>
              )}

              {/* Remarks */}
              <div className="space-y-2">
                <Label className="text-foreground">Remarks (Optional)</Label>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any additional notes..."
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => selectedTransaction ? setSelectedTransaction(null) : navigate(isAdmin ? '/transactions' : '/reports')} 
                  className="flex-1 h-12 rounded-xl"
                >
                  {selectedTransaction && !transactionId ? 'Back' : 'Cancel'}
                </Button>
                <Button 
                  onClick={handleConfirm} 
                  disabled={submitting}
                  className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {isAdmin ? 'Confirm Payment' : 'Pay Fine'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
