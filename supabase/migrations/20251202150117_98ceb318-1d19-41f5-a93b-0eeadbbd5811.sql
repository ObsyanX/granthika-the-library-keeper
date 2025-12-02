-- Create books table
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_no TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'book' CHECK (type IN ('book', 'movie')),
  copies INTEGER NOT NULL DEFAULT 1,
  available_copies INTEGER NOT NULL DEFAULT 1,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_no TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration TEXT NOT NULL DEFAULT '6months' CHECK (duration IN ('6months', '1year', '2years')),
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue')),
  fine INTEGER DEFAULT 0,
  fine_paid BOOLEAN DEFAULT false,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Books policies (public read, authenticated write)
CREATE POLICY "Anyone can view books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update books" ON public.books FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete books" ON public.books FOR DELETE TO authenticated USING (true);

-- Members policies (authenticated only)
CREATE POLICY "Authenticated users can view members" ON public.members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update members" ON public.members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete members" ON public.members FOR DELETE TO authenticated USING (true);

-- Transactions policies (authenticated only)
CREATE POLICY "Authenticated users can view transactions" ON public.transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update transactions" ON public.transactions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete transactions" ON public.transactions FOR DELETE TO authenticated USING (true);

-- Enable realtime for books table
ALTER PUBLICATION supabase_realtime ADD TABLE public.books;
ALTER TABLE public.books REPLICA IDENTITY FULL;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for books
INSERT INTO public.books (serial_no, title, author, genre, type, copies, available_copies) VALUES
  ('BK001', 'The Alchemist', 'Paulo Coelho', 'Fiction', 'book', 5, 3),
  ('BK002', 'Sapiens', 'Yuval Noah Harari', 'Non-Fiction', 'book', 3, 1),
  ('BK003', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 'book', 4, 4),
  ('BK004', 'To Kill a Mockingbird', 'Harper Lee', 'Classic', 'book', 6, 2),
  ('MV001', 'Inception', 'Christopher Nolan', 'Sci-Fi', 'movie', 2, 2),
  ('BK005', 'Pride and Prejudice', 'Jane Austen', 'Romance', 'book', 3, 0),
  ('BK006', '1984', 'George Orwell', 'Dystopian', 'book', 4, 3),
  ('MV002', 'The Shawshank Redemption', 'Frank Darabont', 'Drama', 'movie', 3, 1);

-- Insert seed data for members
INSERT INTO public.members (membership_no, name, email, start_date, duration, end_date, status) VALUES
  ('MEM001', 'Arjun Sharma', 'arjun@email.com', '2024-01-15', '1year', '2025-01-15', 'active'),
  ('MEM002', 'Priya Patel', 'priya@email.com', '2024-06-01', '6months', '2024-12-01', 'expired'),
  ('MEM003', 'Rahul Gupta', 'rahul@email.com', '2024-09-01', '2years', '2026-09-01', 'active'),
  ('MEM004', 'Ananya Singh', 'ananya@email.com', '2024-11-01', '1year', '2025-11-01', 'active');