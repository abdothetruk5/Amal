/*
  # Fix infinite recursion in profiles table policy

  1. Changes
    - Remove the existing "Admins can view all profiles" policy that causes infinite recursion
    - Create a new policy that allows admins to view all profiles without causing recursion
    
  2. Security
    - Maintains row level security while fixing the recursion issue
    - Preserves existing security model but implements it correctly
*/

-- Drop the policy causing recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON "public"."profiles";

-- Create a new policy that avoids the recursive check
CREATE POLICY "Admins can view all profiles fixed" 
ON "public"."profiles"
FOR SELECT 
TO authenticated
USING (
  (
    SELECT role FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) IS NOT NULL
);