/*
  # Add admin role to profiles table

  1. Changes
    - Add role column to profiles table
    - Set default role to 'user'
    - Add check constraint for valid roles

  2. Security
    - Update RLS policies to include role-based access
*/

-- Add role column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

-- Add check constraint for valid roles
ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('user', 'admin'));

-- Update RLS policies for role-based access
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));