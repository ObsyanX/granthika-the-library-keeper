import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Book {
  id: string;
  serial_no: string;
  title: string;
  author: string;
  genre: string;
  type: 'book' | 'movie';
  copies: number;
  available_copies: number;
  cover_url?: string | null;
  created_at: string;
  updated_at: string;
}

type BookRow = {
  id: string;
  serial_no: string;
  title: string;
  author: string;
  genre: string;
  type: string;
  copies: number;
  available_copies: number;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
};

const mapBookRow = (row: BookRow): Book => ({
  ...row,
  type: row.type as 'book' | 'movie',
});

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setBooks((data || []).map(mapBookRow));
    } catch (err: any) {
      console.error('Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('books-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          if (payload.eventType === 'INSERT') {
            setBooks(prev => [...prev, mapBookRow(payload.new as BookRow)].sort((a, b) => a.title.localeCompare(b.title)));
            toast.info('New book added to catalog');
          } else if (payload.eventType === 'UPDATE') {
            setBooks(prev => prev.map(book => 
              book.id === (payload.new as BookRow).id ? mapBookRow(payload.new as BookRow) : book
            ));
          } else if (payload.eventType === 'DELETE') {
            setBooks(prev => prev.filter(book => book.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addBook = async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('books')
      .insert(book)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getBookBySerialNo = async (serialNo: string) => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('serial_no', serialNo)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  const decrementAvailability = async (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.available_copies <= 0) return;

    return updateBook(bookId, { available_copies: book.available_copies - 1 });
  };

  const incrementAvailability = async (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.available_copies >= book.copies) return;

    return updateBook(bookId, { available_copies: book.available_copies + 1 });
  };

  return {
    books,
    loading,
    error,
    refetch: fetchBooks,
    addBook,
    updateBook,
    getBookBySerialNo,
    decrementAvailability,
    incrementAvailability,
    availableBooks: books.filter(b => b.available_copies > 0),
  };
}
