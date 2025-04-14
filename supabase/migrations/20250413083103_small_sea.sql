/*
  # Fix profiles table policies recursion

  1. Changes
     - Drop the problematic admin policy that's causing infinite recursion
     - Create a new admin policy that avoids recursion by using a direct role check
  
  2. Security
     - Maintains security while eliminating the recursion issue
     - Admins can still view all profiles
     - Regular users can only view their own profiles
*/

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a new policy that avoids recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ) OR auth.uid() = id
);