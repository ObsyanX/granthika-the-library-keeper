import { useState } from 'react';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type UserType = 'new' | 'existing';

export default function UserManagement() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('new');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (userType === 'new') {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.password.trim()) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    if (!formData.role) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    toast.success(`User ${userType === 'new' ? 'created' : 'updated'} successfully!`, {
      description: `${formData.name} has been ${userType === 'new' ? 'added' : 'updated'}`,
    });
    setFormData({ name: '', email: '', password: '', role: '' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="neu-card bg-card rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Users className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Add or update system users</p>
            </div>
          </div>

          {/* User Type Toggle */}
          <div className="flex rounded-xl p-1 bg-muted mb-8">
            <button
              type="button"
              onClick={() => setUserType('new')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                userType === 'new'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              New User
            </button>
            <button
              type="button"
              onClick={() => setUserType('existing')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                userType === 'existing'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              Existing User
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter user's full name"
                className={`h-12 rounded-xl ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>

            {userType === 'new' && (
              <>
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
                  <Label htmlFor="password" className="text-foreground">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    className={`h-12 rounded-xl ${errors.password ? 'border-destructive' : ''}`}
                  />
                  {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label className="text-foreground">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className={`h-12 rounded-xl ${errors.role ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="user">Library Member</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-destructive text-sm">{errors.role}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1 h-12 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground">
                {userType === 'new' ? 'Create User' : 'Update User'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
