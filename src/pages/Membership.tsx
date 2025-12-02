import { useState } from 'react';
import { Plus, Search, Edit, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockMembers } from '@/lib/mockData';

export default function Membership() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Membership Management</h1>
            <p className="text-muted-foreground">Manage library memberships</p>
          </div>
          <Button onClick={() => navigate('/membership/add')} className="gradient-primary text-primary-foreground rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Membership
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, or membership no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>

        {/* Members Table */}
        <div className="neu-card bg-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Member</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Membership No</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Duration</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">End Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </td>
                    <td className="py-4 px-6 text-foreground font-mono">{member.membershipNo}</td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {member.duration === '6months' ? '6 Months' : member.duration === '1year' ? '1 Year' : '2 Years'}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{member.endDate}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active' ? 'bg-accent text-accent-foreground' :
                        member.status === 'expired' ? 'bg-destructive/10 text-destructive' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/membership/edit/${member.membershipNo}`)}
                        className="rounded-lg"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No members found matching your search</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
