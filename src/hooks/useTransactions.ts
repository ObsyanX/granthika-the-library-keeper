import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Transaction {
  id: string;
  book_id: string;
  member_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string | null;
  status: 'issued' | 'returned' | 'overdue';
  fine?: number | null;
  fine_paid?: boolean | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  book?: {
    id: string;
    title: string;
    author: string;
    serial_no: string;
  } | null;
  member?: {
    id: string;
    name: string;
    membership_no: string;
  } | null;
}

type TransactionRow = {
  id: string;
  book_id: string;
  member_id: string;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  fine: number | null;
  fine_paid: boolean | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  book: { id: string; title: string; author: string; serial_no: string } | null;
  member: { id: string; name: string; membership_no: string } | null;
};

const mapTransactionRow = (row: TransactionRow): Transaction => ({
  ...row,
  status: row.status as 'issued' | 'returned' | 'overdue',
});

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          book:books(id, title, author, serial_no),
          member:members(id, name, membership_no)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions((data || []).map(row => mapTransactionRow(row as TransactionRow)));
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const createTransaction = async (transaction: {
    book_id: string;
    member_id: string;
    issue_date: string;
    due_date: string;
    remarks?: string;
  }) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, status: 'issued' })
      .select()
      .single();

    if (error) throw error;
    await fetchTransactions();
    return data;
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchTransactions();
    return data;
  };

  const returnBook = async (id: string, returnDate: string, fine: number = 0, finePaid: boolean = false) => {
    return updateTransaction(id, {
      return_date: returnDate,
      status: 'returned',
      fine,
      fine_paid: finePaid,
    });
  };

  const getIssuedTransactions = () => transactions.filter(t => t.status === 'issued' || t.status === 'overdue');
  const getOverdueTransactions = () => transactions.filter(t => t.status === 'overdue');
  const getReturnedTransactions = () => transactions.filter(t => t.status === 'returned');

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    returnBook,
    issuedTransactions: getIssuedTransactions(),
    overdueTransactions: getOverdueTransactions(),
    returnedTransactions: getReturnedTransactions(),
  };
}
