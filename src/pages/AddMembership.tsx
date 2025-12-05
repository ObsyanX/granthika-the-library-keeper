import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format, addMonths, addYears } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useMembers } from '@/hooks/useMembers';

type Duration = '6months' | '1year' | '2years';

function generateMembershipNo(): string {
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MEM${random}`;
}

function calculateEndDate(startDate: string, duration: Duration): string {
  const start = new Date(startDate);
  switch (duration) {
    case '6months':
      return format(addMonths(start, 6), 'yyyy-MM-dd');
    case '1year':
      return format(addYears(start, 1), 'yyyy-MM-dd');
    case '2years':
      return format(addYears(start, 2), 'yyyy-MM-dd');
  }
}

export default function AddMembership() {
  const navigate = useNavigate();
  const { addMember } = useMembers();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    contactAddress: '',
    aadharCard: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [duration, setDuration] = useState<Duration>('6months');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.contactAddress.trim()) newErrors.contactAddress = 'Contact address is required';
    if (!formData.aadharCard.trim()) newErrors.aadharCard = 'Aadhar card number is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const membershipNo = generateMembershipNo();
      const endDate = calculateEndDate(formData.startDate, duration);
      const fullName = `${formData.firstName} ${formData.lastName}`;

      await addMember({
        membership_no: membershipNo,
        name: fullName,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        contact_number: formData.contactNumber,
        contact_address: formData.contactAddress,
        aadhar_card: formData.aadharCard,
        start_date: formData.startDate,
        duration,
        end_date: endDate,
        status: 'active',
      });

      toast.success('Membership created successfully!', {
        description: `${fullName} has been registered with ID: ${membershipNo}`,
      });
      navigate('/membership');
    } catch (error: any) {
      toast.error('Failed to create membership', { description: error.message });
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
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">Add New Membership</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  className={`h-12 rounded-xl ${errors.firstName ? 'border-destructive' : ''}`}
                />
                {errors.firstName && <p className="text-destructive text-sm">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  className={`h-12 rounded-xl ${errors.lastName ? 'border-destructive' : ''}`}
                />
                {errors.lastName && <p className="text-destructive text-sm">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className={`h-12 rounded-xl ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber" className="text-foreground">Contact Number *</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="Enter contact number"
                className={`h-12 rounded-xl ${errors.contactNumber ? 'border-destructive' : ''}`}
              />
              {errors.contactNumber && <p className="text-destructive text-sm">{errors.contactNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactAddress" className="text-foreground">Contact Address *</Label>
              <Textarea
                id="contactAddress"
                value={formData.contactAddress}
                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                placeholder="Enter full address"
                className={`rounded-xl ${errors.contactAddress ? 'border-destructive' : ''}`}
                rows={3}
              />
              {errors.contactAddress && <p className="text-destructive text-sm">{errors.contactAddress}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadharCard" className="text-foreground">Aadhar Card No *</Label>
              <Input
                id="aadharCard"
                value={formData.aadharCard}
                onChange={(e) => setFormData({ ...formData, aadharCard: e.target.value })}
                placeholder="Enter 12-digit Aadhar number"
                className={`h-12 rounded-xl ${errors.aadharCard ? 'border-destructive' : ''}`}
              />
              {errors.aadharCard && <p className="text-destructive text-sm">{errors.aadharCard}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-foreground">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`h-12 rounded-xl ${errors.startDate ? 'border-destructive' : ''}`}
              />
              {errors.startDate && <p className="text-destructive text-sm">{errors.startDate}</p>}
            </div>

            <div className="space-y-3">
              <Label className="text-foreground">Membership Duration *</Label>
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

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/membership')} className="flex-1 h-12 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Membership
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}