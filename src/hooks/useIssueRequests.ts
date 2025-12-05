import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface IssueRequest {
  id: string;
  member_id: string;
  book_title: string;
  requested_date: string;
  fulfilled_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  member?: {
    id: string;
    name: string;
    membership_no: string;
  };
}

export function useIssueRequests() {
  const [issueRequests, setIssueRequests] = useState<IssueRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssueRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('issue_requests')
        .select(`
          *,
          member:members(id, name, membership_no)
        `)
        .order('requested_date', { ascending: false });

      if (error) throw error;
      setIssueRequests(data as IssueRequest[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueRequests();
  }, []);

  const pendingRequests = issueRequests.filter(r => r.status === 'pending');
  const fulfilledRequests = issueRequests.filter(r => r.status === 'fulfilled');

  const createRequest = async (memberId: string, bookTitle: string) => {
    const { error } = await supabase
      .from('issue_requests')
      .insert({
        member_id: memberId,
        book_title: bookTitle,
        status: 'pending'
      });
    if (error) throw error;
    await fetchIssueRequests();
  };

  const fulfillRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('issue_requests')
      .update({
        status: 'fulfilled',
        fulfilled_date: new Date().toISOString().split('T')[0]
      })
      .eq('id', requestId);
    if (error) throw error;
    await fetchIssueRequests();
  };

  return {
    issueRequests,
    pendingRequests,
    fulfilledRequests,
    loading,
    error,
    refetch: fetchIssueRequests,
    createRequest,
    fulfillRequest
  };
}
