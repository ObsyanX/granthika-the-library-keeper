import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { format, addMonths, addYears } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useMembers, Member } from '@/hooks/useMembers';

type Duration = '6months' | '1year' | '2years';
type Action = 'extend' | 'cancel';

function calculateNewEndDate(currentEndDate: string, duration: Duration): string {
  const end = new Date(currentEndDate);
  switch (duration) {
    case '6months':
      return format(addMonths(end, 6), 'yyyy-MM-dd');
    case '1year':
      return format(addYears(end, 1), 'yyyy-MM-dd');
    case '2years':
      return format(addYears(end, 2), 'yyyy-MM-dd');
  }
}

export default function UpdateMembership() {
  const navigate = useNavigate();
  const { getMemberByMembershipNo, updateMember } = useMembers();
  
  const [membershipNo, setMembershipNo] = useState('');
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [action, setAction] = useState<Action>('extend');
  const [duration, setDuration] = useState<Duration>('6months');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSearch = async () => {
    if (!membershipNo.trim()) {
      setSearchError('Please enter a membership number');
      return;
    }
    
    setSearching(true);
    setSearchError('');
    
    try {
      const member = await getMemberByMembershipNo(membershipNo.trim());
      if (!member) {
        setSearchError('Member not found with this membership number');
        setFoundMember(null);
      } else {
        setFoundMember(member as Member);
      }
    } catch (error: any) {
      setSearchError('Error searching for member');
    } finally {
      setSearching(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!membershipNo.trim()) newErrors.membershipNo = 'Membership number is required';
    if (!foundMember) newErrors.membershipNo = 'Please enter a valid membership number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !foundMember) return;

    setSubmitting(true);
    try {
      if (action === 'cancel') {
        await updateMember(foundMember.id, { status: 'cancelled' });
        toast.success('Membership cancelled!', {
          description: `${foundMember.name}'s membership has been cancelled`,
        });
      } else {
        const newEndDate = calculateNewEndDate(foundMember.end_date, duration);
        await updateMember(foundMember.id, { 
          end_date: newEndDate,
          status: 'active',
        });
        const durationLabel = duration === '6months' ? '6 months' : duration === '1year' ? '1 year' : '2 years';
        toast.success('Membership extended!', {
          description: `${foundMember.name}'s membership extended by ${durationLabel}`,
        });
      }
      navigate('/membership');
    } catch (error: any) {
      toast.error('Failed to update membership', { description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/membership')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Memberships
        </Button>

        <div className="neu-card bg-card rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">Update Membership</h1>

          {/* Membership Number Search */}
          <div className="mb-6 space-y-2">
            <Label htmlFor="membershipNo" className="text-foreground">Membership Number *</Label>
            <div className="flex gap-3">
              <Input
                id="membershipNo"
                value={membershipNo}
                onChange={(e) => setMembershipNo(e.target.value)}
                placeholder="Enter membership number (e.g., MEM001)"
                className={`flex-1 h-12 rounded-xl ${errors.membershipNo || searchError ? 'border-destructive' : ''}`}
              />
              <Button onClick={handleSearch} disabled={searching} className="h-12 px-6 rounded-xl gradient-primary text-primary-foreground">
                {searching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                Find
              </Button>
            </div>
            {(errors.membershipNo || searchError) && (
              <p className="text-destructive text-sm">{errors.membershipNo || searchError}</p>
            )}
          </div>

          {/* Member Details (Auto-populated) */}
          {foundMember && (
            <form onSubmit={handleSubmit} className="space-y-6 border-t border-border pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Name</Label>
                  <Input value={foundMember.name} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <Input value={foundMember.email} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Start Date</Label>
                  <Input value={foundMember.start_date} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">End Date</Label>
                  <Input value={foundMember.end_date} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Current Status</Label>
                  <Input 
                    value={foundMember.status.charAt(0).toUpperCase() + foundMember.status.slice(1)} 
                    disabled 
                    className="h-12 rounded-xl bg-muted" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Current Duration</Label>
                  <Input 
                    value={foundMember.duration === '6months' ? '6 Months' : foundMember.duration === '1year' ? '1 Year' : '2 Years'} 
                    disabled 
                    className="h-12 rounded-xl bg-muted" 
                  />
                </div>
              </div>

              {/* Action Selection */}
              <div className="space-y-3">
                <Label className="text-foreground">Action *</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label
                    className={`flex-1 p-4 rounded-xl cursor-pointer transition-all border-2 text-center ${
                      action === 'extend'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="extend"
                      checked={action === 'extend'}
                      onChange={() => setAction('extend')}
                      className="sr-only"
                    />
                    <span className={`font-medium ${action === 'extend' ? 'text-primary' : 'text-foreground'}`}>
                      Extend Membership
                    </span>
                  </label>
                  <label
                    className={`flex-1 p-4 rounded-xl cursor-pointer transition-all border-2 text-center ${
                      action === 'cancel'
                        ? 'border-destructive bg-destructive/10'
                        : 'border-border hover:border-destructive/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="cancel"
                      checked={action === 'cancel'}
                      onChange={() => setAction('cancel')}
                      className="sr-only"
                    />
                    <span className={`font-medium ${action === 'cancel' ? 'text-destructive' : 'text-foreground'}`}>
                      Cancel Membership
                    </span>
                  </label>
                </div>
              </div>

              {/* Duration Selection (only shown when extending) */}
              {action === 'extend' && (
                <div className="space-y-3">
                  <Label className="text-foreground">Extension Duration *</Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {[
                      { value: '6months', label: '6 Months' },
                      { value: '1year', label: '1 Year' },
                      { value: '2years', label: '2 Years' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex-1 p-4 rounded-xl cursor-pointer transition-all border-2 text-center ${
                          duration === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="duration"
                          value={option.value}
                          checked={duration === option.value}
                          onChange={() => setDuration(option.value as Duration)}
                          className="sr-only"
                        />
                        <span className={`font-medium ${duration === option.value ? 'text-primary' : 'text-foreground'}`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {action === 'cancel' && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-destructive font-medium">⚠️ Warning</p>
                  <p className="text-sm text-muted-foreground">
                    This will permanently cancel the membership. This action cannot be undone.
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/membership')} className="flex-1 h-12 rounded-xl">
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 h-12 rounded-xl ${
                    action === 'cancel' 
                      ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                      : 'gradient-primary text-primary-foreground'
                  }`}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {action === 'extend' ? 'Extend Membership' : 'Cancel Membership'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
