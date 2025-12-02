import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { mockMembers, Member } from '@/lib/mockData';

type Duration = '6months' | '1year' | '2years';
type Action = 'extend' | 'cancel';

export default function UpdateMembership() {
  const navigate = useNavigate();
  const [membershipNo, setMembershipNo] = useState('');
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [action, setAction] = useState<Action>('extend');
  const [duration, setDuration] = useState<Duration>('6months');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchError, setSearchError] = useState('');

  // Auto-populate when membership number matches
  useEffect(() => {
    if (membershipNo.trim()) {
      const member = mockMembers.find(
        m => m.membershipNo.toLowerCase() === membershipNo.toLowerCase()
      );
      if (member) {
        setFoundMember(member);
        setSearchError('');
      } else {
        setFoundMember(null);
      }
    } else {
      setFoundMember(null);
    }
  }, [membershipNo]);

  const handleSearch = () => {
    if (!membershipNo.trim()) {
      setSearchError('Please enter a membership number');
      return;
    }
    const member = mockMembers.find(
      m => m.membershipNo.toLowerCase() === membershipNo.toLowerCase()
    );
    if (!member) {
      setSearchError('Member not found with this membership number');
    } else {
      setFoundMember(member);
      setSearchError('');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!membershipNo.trim()) newErrors.membershipNo = 'Membership number is required';
    if (!foundMember) newErrors.membershipNo = 'Please enter a valid membership number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (action === 'cancel') {
      toast.success('Membership cancelled!', {
        description: `${foundMember?.name}'s membership has been cancelled`,
      });
    } else {
      const durationLabel = duration === '6months' ? '6 months' : duration === '1year' ? '1 year' : '2 years';
      toast.success('Membership extended!', {
        description: `${foundMember?.name}'s membership extended by ${durationLabel}`,
      });
    }
    navigate('/membership');
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
              <Button onClick={handleSearch} className="h-12 px-6 rounded-xl gradient-primary text-primary-foreground">
                <Search className="w-4 h-4 mr-2" />
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
                  <Input value={foundMember.startDate} disabled className="h-12 rounded-xl bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">End Date</Label>
                  <Input value={foundMember.endDate} disabled className="h-12 rounded-xl bg-muted" />
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
                  className={`flex-1 h-12 rounded-xl ${
                    action === 'cancel' 
                      ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                      : 'gradient-primary text-primary-foreground'
                  }`}
                >
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
