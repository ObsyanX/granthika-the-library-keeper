-- Fix RLS policy for user_roles to allow users to insert their own role on signup
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
CREATE POLICY "Users can insert their own role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Sync existing member "Sayan Dutta" with matching auth user
UPDATE public.members 
SET user_id = '423d4304-b678-44aa-a445-c8cee77458fc'
WHERE email = 'duttasayan947595@gmail.com' AND user_id IS NULL;

-- Insert role for existing admin user (duttasayan947595@gmail.com was signing up as admin)
INSERT INTO public.user_roles (user_id, role)
VALUES ('423d4304-b678-44aa-a445-c8cee77458fc', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert user role for other auth users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'::app_role FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;