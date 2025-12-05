import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Users, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type UserType = 'new' | 'existing';

interface SystemUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('new');
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userType === 'existing') {
      fetchUsers();
    }
  }, [userType]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'list-users' }
      });
      
      if (error) throw error;
      setUsers(data.users || []);
    } catch (error: any) {
      toast.error('Failed to load users', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (userType === 'new') {
        const { data, error } = await supabase.functions.invoke('manage-users', {
          body: { 
            action: 'create-user',
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: formData.role
          }
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        toast.success('User created successfully!', {
          description: `${formData.name} has been added as ${formData.role}`,
        });
      } else if (selectedUser) {
        const { data, error } = await supabase.functions.invoke('manage-users', {
          body: { 
            action: 'update-role',
            userId: selectedUser.id,
            role: formData.role
          }
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        toast.success('User updated successfully!', {
          description: `${selectedUser.name || selectedUser.email}'s role has been updated to ${formData.role}`,
        });
        fetchUsers();
      }
      
      setFormData({ name: '', email: '', password: '', role: '' });
      setSelectedUser(null);
    } catch (error: any) {
      toast.error('Operation failed', { description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectUser = (user: SystemUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      password: '',
      role: user.role,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-6">
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
              <p className="text-muted-foreground">Add or update system users and roles</p>
            </div>
          </div>

          {/* User Type Toggle */}
          <div className="flex rounded-xl p-1 bg-muted mb-8">
            <button
              type="button"
              onClick={() => {
                setUserType('new');
                setSelectedUser(null);
                setFormData({ name: '', email: '', password: '', role: '' });
              }}
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
              Existing Users
            </button>
          </div>

          {/* Existing Users List */}
          {userType === 'existing' && (
            <div className="mb-8">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="border border-border rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow 
                            key={user.id} 
                            className={`cursor-pointer ${selectedUser?.id === user.id ? 'bg-primary/10' : ''}`}
                            onClick={() => handleSelectUser(user)}
                          >
                            <TableCell className="font-medium">{user.name || '-'}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectUser(user);
                                }}
                              >
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter user's full name"
                disabled={userType === 'existing' && !selectedUser}
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

            {userType === 'existing' && selectedUser && (
              <div className="space-y-2">
                <Label className="text-foreground">Email Address</Label>
                <Input
                  value={selectedUser.email}
                  disabled
                  className="h-12 rounded-xl bg-muted"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-foreground">Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                disabled={userType === 'existing' && !selectedUser}
              >
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin')} 
                className="flex-1 h-12 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting || (userType === 'existing' && !selectedUser)}
                className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {userType === 'new' ? 'Create User' : 'Update Role'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}