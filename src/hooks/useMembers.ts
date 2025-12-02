import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Member {
  id: string;
  membership_no: string;
  name: string;
  email: string;
  start_date: string;
  duration: '6months' | '1year' | '2years';
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
  updated_at: string;
}

type MemberRow = {
  id: string;
  membership_no: string;
  name: string;
  email: string;
  start_date: string;
  duration: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const mapMemberRow = (row: MemberRow): Member => ({
  ...row,
  duration: row.duration as '6months' | '1year' | '2years',
  status: row.status as 'active' | 'expired' | 'cancelled',
});

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setMembers((data || []).map(mapMemberRow));
    } catch (err: any) {
      console.error('Error fetching members:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const addMember = async (member: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('members')
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    await fetchMembers();
    return data;
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchMembers();
    return data;
  };

  const getMemberByMembershipNo = async (membershipNo: string) => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('membership_no', membershipNo)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
    addMember,
    updateMember,
    getMemberByMembershipNo,
    activeMembers: members.filter(m => m.status === 'active'),
  };
}
