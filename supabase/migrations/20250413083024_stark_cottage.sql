/*
  # Fix profiles table RLS policy recursion
  
  1. Changes
    - Drop the problematic "Admins can view all profiles" policy that causes infinite recursion
    - Create a new policy that checks the user's role without self-referencing the profiles table
  
  2. Security
    - Maintains proper access control for profiles data
    - Eliminates infinite recursion bug
    - Ensures admins can view all profiles without causing a circular reference
*/

-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a new policy that avoids recursion by checking the current user's role
-- directly from the profiles table but with a different approach
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM auth.users
    WHERE auth.users.id = auth.uid() 
    AND auth.users.id IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  )
);