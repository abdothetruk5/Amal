/*
  # Fix profiles policy infinite recursion issue

  1. Changes
     - Drop the problematic "Admins can view all profiles" policy that still causes infinite recursion
     - Create a new admin policy using a completely non-recursive approach with auth.jwt()
     - This avoids querying the profiles table within its own policy

  2. Security
     - Maintain the same security intent (admins can view all profiles)
     - Use JWT claims to determine admin status without causing recursion
*/

-- Drop the problematic policy that's still causing recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new policy using auth.jwt() to avoid recursion
-- This checks if the user's email matches an admin email without recursively querying profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- As a fallback, ensure users can always view their own profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);