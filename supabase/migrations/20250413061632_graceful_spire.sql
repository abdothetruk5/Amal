/*
  # Add INSERT policy for profiles table
  
  1. Security
    - Add policy for authenticated users to insert their own profile
    - This resolves the RLS violation error during user signup
*/

-- Add policy to allow authenticated users to insert their own profile
CREATE POLICY "Users can create own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);