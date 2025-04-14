/*
  # Fix infinite recursion in profiles RLS policy

  1. Changes
    - Drop the problematic "Admins can view all profiles" policy that causes infinite recursion
    - Create a new policy that achieves the same goal without recursion
    - Use a simpler approach with auth.jwt() to check admin role

  2. Security
    - Maintains the same security intent - admins can view all profiles, users can only view their own
    - Prevents infinite recursion error when querying profiles
*/

-- Drop the policy causing infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a new policy that achieves the same goal without recursion
-- This uses auth.jwt() to safely check the user's role without causing a recursive query
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  (auth.jwt() ->> 'role' = 'admin') OR (auth.uid() = id)
);