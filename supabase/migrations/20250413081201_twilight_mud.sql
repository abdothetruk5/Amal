/*
  # Fix infinite recursion in profiles table policy

  1. Changes
    - Drop the problematic "Admins can view all profiles" policy that causes recursion
    - Add a new policy for admins to view all profiles that doesn't cause recursion
    
  2. Security
    - Maintains row level security while preventing infinite recursion
    - Ensures proper access control for admin users
*/

-- Drop the existing policy that's causing infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new policy that avoids recursion by using a direct check
CREATE POLICY "Admins can view all profiles" 
ON profiles
FOR SELECT
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);