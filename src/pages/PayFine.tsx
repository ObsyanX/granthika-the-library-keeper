import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { mockTransactions } from '@/lib/mockData';

export default function PayFine() {
  const navigate = useNavigate();
  const location = useLocation();
  const transactionId = (location.state as any)?.transactionId;
  
  // Find transaction or use first overdue one
  const transaction = transactionId 
    ? mockTransactions.find(t => t.id === transactionId)
    : mockTransactions.find(t => t.status === 'overdue');

  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  // Calculate fine (₹10 per day overdue)
  const calculateFine = () => {
    if (!transaction) return 0;
    const dueDate = new Date(transaction.dueDate);
    const today = new Date();
    const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    return daysOverdue * 10;
  };

  const fine = transaction?.fine || calculateFine();

  const handleConfirm = () => {
    if (fine > 0 && !finePaid) {
      setError('Please confirm that the fine has been paid');
      return;
    }

    toast.success('Transaction completed!', {
      description: fine > 0 ? `Fine of ₹${fine} has been recorded` : 'Book returned successfully',
    });
    navigate('/transactions');
  };

  if (!transaction) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Button variant="ghost" onClick={() => navigate('/transactions')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Button>

          <div className="neu-card bg-card rounded-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-accent-foreground mb-4" />
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">No Fine Due</h2>
            <p className="text-muted-foreground mb-6">There are no pending fines at this time.</p>
            <Button onClick={() => navigate('/transactions')} className="gradient-primary text-primary-foreground rounded-xl">
              Back to Transactions
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/transactions')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transactions
        </Button>

        <div className="neu-card bg-card rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-secondary flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Pay Fine</h1>
              <p className="text-muted-foreground">Complete the return process</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Auto-filled Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Book</Label>
                <Input value={transaction.bookTitle} disabled className="h-12 rounded-xl bg-muted" />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Author</Label>
                <Input value={transaction.author} disabled className="h-12 rounded-xl bg-muted" />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Member</Label>
                <Input value={transaction.memberName} disabled className="h-12 rounded-xl bg-muted" />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Serial Number</Label>
                <Input value={transaction.serialNo} disabled className="h-12 rounded-xl bg-muted" />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Issue Date</Label>
                <Input value={transaction.issueDate} disabled className="h-12 rounded-xl bg-muted" />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Due Date</Label>
                <Input value={transaction.dueDate} disabled className="h-12 rounded-xl bg-muted" />
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
                  <p className="text-sm text-muted-foreground">₹10 per day overdue</p>
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
                    I confirm that the fine of ₹{fine} has been paid
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
              <Button type="button" variant="outline" onClick={() => navigate('/transactions')} className="flex-1 h-12 rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleConfirm} className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
