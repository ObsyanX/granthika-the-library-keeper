-- Phase 1: Update members table with additional fields
ALTER TABLE public.members
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS contact_number text,
ADD COLUMN IF NOT EXISTS contact_address text,
ADD COLUMN IF NOT EXISTS aadhar_card text;

-- Phase 1: Update books table with cost and procurement date
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS cost numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS procurement_date date DEFAULT CURRENT_DATE;

-- Phase 1: Create issue_requests table for pending book requests
CREATE TABLE IF NOT EXISTS public.issue_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  book_title text NOT NULL,
  requested_date date NOT NULL DEFAULT CURRENT_DATE,
  fulfilled_date date,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on issue_requests
ALTER TABLE public.issue_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for issue_requests
CREATE POLICY "Authenticated users can view issue requests"
ON public.issue_requests FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert issue requests"
ON public.issue_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update issue requests"
ON public.issue_requests FOR UPDATE
USING (true);

CREATE POLICY "Authenticated users can delete issue requests"
ON public.issue_requests FOR DELETE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_issue_requests_updated_at
BEFORE UPDATE ON public.issue_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Link members to auth users (for auto-populating member info)
ALTER TABLE public.members
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;