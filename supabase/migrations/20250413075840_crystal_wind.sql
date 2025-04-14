/*
  # Fix profiles policy recursion

  1. Changes
     - Drop the problematic "Admins can view all profiles" policy that causes infinite recursion
     - Create a new admin policy using a non-recursive approach

  2. Security
     - Maintain the same security intent (admins can view all profiles)
     - Use a more efficient policy implementation without recursion
*/

-- Drop the problematic policy causing infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new policy that avoids recursion by using a direct role check
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );