import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, RefreshCw, Loader2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTransactions } from '@/hooks/useTransactions';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/hooks/useMembers';

export default function ReturnBook() {
  const navigate = useNavigate();
  const { issuedTransactions, overdueTransactions, returnBook, loading } = useTransactions();
  const { books, updateBook } = useBooks();
  const { user, isAdmin } = useAuth();
  const { getDailyFineRate } = useSettings();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [userMember, setUserMember] = useState<Member | null>(null);
  const [memberLoading, setMemberLoading] = useState(!isAdmin);

  const finePerDay = getDailyFineRate();

  // Fetch user's membership for non-admins
  useEffect(() => {
    const fetchUserMember = async () => {
      if (!isAdmin && user?.id) {
        setMemberLoading(true);
        const { data } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data) {
          setUserMember(data as Member);
        }
        setMemberLoading(false);
      }
    };
    fetchUserMember();
  }, [user, isAdmin]);

  // Filter transactions based on role
  const allIssuedTransactions = [...issuedTransactions, ...overdueTransactions];
  const filteredByRole = isAdmin 
    ? allIssuedTransactions 
    : allIssuedTransactions.filter(t => t.member_id === userMember?.id);
  
  const filteredTransactions = filteredByRole.filter(t => 
    t.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.book?.serial_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.member?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedData = allIssuedTransactions.find(t => t.id === selectedTransaction);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedTransaction) newErrors.transaction = 'Please select a transaction';
    if (!returnDate) newErrors.returnDate = 'Return date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateFine = () => {
    if (!selectedData) return 0;
    const dueDate = new Date(selectedData.due_date);
    const returnDt = new Date(returnDate);
    const daysOverdue = differenceInDays(returnDt, dueDate);
    return daysOverdue > 0 ? daysOverdue * finePerDay : 0;
  };

  const handleConfirm = async () => {
    if (!validate() || !selectedData) return;

    setSubmitting(true);
    try {
      const fine = calculateFine();
      await returnBook(selectedTransaction!, returnDate, fine, false);

      // Increment available copies
      const book = books.find(b => b.id === selectedData.book_id);
      if (book) {
        await updateBook(book.id, {
          available_copies: book.available_copies + 1,
        });
      }

      toast.success('Book returned!', {
        description: fine > 0 
          ? `Fine of ₹${fine} is pending. Redirecting to pay fine...`
          : `"${selectedData.book?.title}" has been returned successfully`,
      });
      
      // Always redirect to Pay Fine page after return (per Excel spec)
      navigate('/transactions/fine', { state: { transactionId: selectedTransaction } });
    } catch (error: any) {
      toast.error('Failed to return book', { description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || memberLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Check if non-admin user has membership
  if (!isAdmin && !userMember) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto animate-fade-in">
          <Button variant="ghost" onClick={() => navigate('/transactions')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Button>
          <div className="neu-card bg-card rounded-2xl p-8 text-center">
            <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Membership Found</h2>
            <p className="text-muted-foreground">You need an active membership to return books.</p>
            <p className="text-muted-foreground text-sm mt-2">Contact the librarian to register for a membership.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/transactions')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transactions
        </Button>

        <div className="neu-card bg-card rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">Return Book</h1>

          {/* Search Section */}
          <div className="mb-8">
            <Label className="text-foreground mb-2 block">Search Issued Books</Label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by book title, serial, or member name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Search Results */}
          {filteredTransactions.length > 0 && (
            <div className="mb-8 space-y-2">
              <Label className="text-foreground">Select Transaction</Label>
              <div className="max-h-64 overflow-y-auto space-y-2 rounded-xl border border-border p-2">
                {filteredTransactions.map((transaction) => (
                  <label
                    key={transaction.id}
                    className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedTransaction === transaction.id ? 'bg-primary/10 border border-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="transaction"
                      value={transaction.id}
                      checked={selectedTransaction === transaction.id}
                      onChange={() => setSelectedTransaction(transaction.id)}
                      className="sr-only"
                    />
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{transaction.book?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.member?.name} • Serial: {transaction.book?.serial_no}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        transaction.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                      }`}>
                        {transaction.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">Due: {transaction.due_date}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.transaction && <p className="text-destructive text-sm">{errors.transaction}</p>}
            </div>
          )}

          {/* Return Form */}
          {selectedTransaction && selectedData && (
            <div className="space-y-6 border-t border-border pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Book Name</Label>
                  <Input value={selectedData.book?.title || ''} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Author</Label>
                  <Input value={selectedData.book?.author || ''} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Serial Number</Label>
                  <Input value={selectedData.book?.serial_no || ''} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Member</Label>
                  <Input value={selectedData.member?.name || ''} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Issue Date</Label>
                  <Input value={selectedData.issue_date} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Due Date</Label>
                  <Input value={selectedData.due_date} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Return Date *</Label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={`h-12 rounded-xl ${errors.returnDate ? 'border-destructive' : ''}`}
                  />
                  {errors.returnDate && <p className="text-destructive text-sm">{errors.returnDate}</p>}
                </div>

                {calculateFine() > 0 && (
                  <div className="space-y-2">
                    <Label className="text-foreground">Estimated Fine</Label>
                    <Input value={`₹${calculateFine()}`} disabled className="h-12 rounded-xl bg-muted text-destructive font-semibold" />
                  </div>
                )}
              </div>

              {selectedData.status === 'overdue' && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-destructive font-medium">⚠️ This book is overdue!</p>
                  <p className="text-sm text-muted-foreground">Fine: ₹{finePerDay}/day after due date</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/transactions')} className="flex-1 h-12 rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={submitting} className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Confirm Return
                </Button>
              </div>
            </div>
          )}

          {filteredTransactions.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No issued books found matching your search</p>
            </div>
          )}

          {filteredTransactions.length === 0 && !searchTerm && (
            <div className="text-center py-8">
              <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No books currently issued</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
