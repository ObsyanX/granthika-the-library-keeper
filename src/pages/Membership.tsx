import { useState } from 'react';
import { Plus, Search, Edit, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MotionButton } from '@/components/ui/motion-button';
import { useBasePath } from '@/hooks/useBasePath';
import { Input } from '@/components/ui/input';
import { useMembers } from '@/hooks/useMembers';
import { TableSkeleton } from '@/components/skeletons';

export default function Membership() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { members, loading } = useMembers();
  const p = useBasePath();

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membership_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <div className="h-7 w-64 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <TableSkeleton rows={6} columns={5} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Membership Management</h1>
            <p className="text-muted-foreground">Manage library memberships</p>
          </div>
          <div className="flex gap-2">
            <MotionButton onClick={() => navigate(p('/membership/update'))} variant="outline" className="rounded-xl">
              <Edit className="w-4 h-4 mr-2" />
              Update
            </MotionButton>
            <MotionButton onClick={() => navigate(p('/membership/add'))} className="gradient-primary text-primary-foreground rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Membership
            </MotionButton>
          </div>
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
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </td>
                    <td className="py-4 px-6 text-foreground font-mono">{member.membership_no}</td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {member.duration === '6months' ? '6 Months' : member.duration === '1year' ? '1 Year' : '2 Years'}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{member.end_date}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active' ? 'bg-accent text-accent-foreground' :
                        member.status === 'expired' ? 'bg-destructive/10 text-destructive' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
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
