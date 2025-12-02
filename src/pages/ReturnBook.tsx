import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockTransactions } from '@/lib/mockData';

export default function ReturnBook() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const issuedTransactions = mockTransactions.filter(t => 
    (t.status === 'issued' || t.status === 'overdue') &&
    (t.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.memberName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedData = mockTransactions.find(t => t.id === selectedTransaction);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedTransaction) newErrors.transaction = 'Please select a transaction';
    if (!returnDate) newErrors.returnDate = 'Return date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    // Always navigate to pay fine page after return
    navigate('/transactions/fine', { state: { transactionId: selectedTransaction } });
  };

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
          {issuedTransactions.length > 0 && (
            <div className="mb-8 space-y-2">
              <Label className="text-foreground">Select Transaction</Label>
              <div className="max-h-64 overflow-y-auto space-y-2 rounded-xl border border-border p-2">
                {issuedTransactions.map((transaction) => (
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
                      <p className="font-medium text-foreground">{transaction.bookTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.memberName} • Serial: {transaction.serialNo}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        transaction.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                      }`}>
                        {transaction.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">Due: {transaction.dueDate}</p>
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
                  <Input value={selectedData.bookTitle} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Author</Label>
                  <Input value={selectedData.author} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Serial Number</Label>
                  <Input value={selectedData.serialNo} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Member</Label>
                  <Input value={selectedData.memberName} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Issue Date</Label>
                  <Input value={selectedData.issueDate} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Due Date</Label>
                  <Input value={selectedData.dueDate} disabled className="h-12 rounded-xl bg-muted" />
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
              </div>

              {selectedData.status === 'overdue' && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-destructive font-medium">⚠️ This book is overdue!</p>
                  <p className="text-sm text-muted-foreground">Fine will be calculated on the next screen.</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/transactions')} className="flex-1 h-12 rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleConfirm} className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground">
                  Confirm Return
                </Button>
              </div>
            </div>
          )}

          {issuedTransactions.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No issued books found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
