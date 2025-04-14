/*
  # Fix infinite recursion in profiles RLS policy

  1. Changes
     - Drop the problematic "Admins can view all profiles fixed" policy that causes infinite recursion
     - Create a new admin policy that avoids the recursive query pattern

  2. Security
     - Maintain the same security intent: admins can view all profiles
     - Fix the implementation to avoid recursion
*/

-- Drop the problematic policy causing infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles fixed" ON public.profiles;

-- Create a new admin policy that doesn't recursively query the same table
CREATE POLICY "Admins can view all profiles" 
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);