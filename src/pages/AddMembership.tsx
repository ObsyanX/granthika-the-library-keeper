import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type Duration = '6months' | '1year' | '2years';

export default function AddMembership() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [duration, setDuration] = useState<Duration>('6months');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    toast.success('Membership created successfully!', {
      description: `${formData.name} has been registered`,
    });
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
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">Add New Membership</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter member's full name"
                className={`h-12 rounded-xl ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
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
              <Button type="submit" className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground">
                Create Membership
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
