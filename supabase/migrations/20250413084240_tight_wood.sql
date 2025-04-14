/*
  # Create site settings table for admin customization

  1. New Tables
    - `site_settings` - Stores customizable site configuration
      - `id` (uuid, primary key)
      - `key` (text, unique) - Setting identifier
      - `value` (text) - Setting value
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on site_settings table
    - Admin-only access for write operations
    - Public read access
*/

-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view site settings" 
  ON site_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert site settings" 
  ON site_settings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can update site settings" 
  ON site_settings 
  FOR UPDATE 
  TO authenticated 
  USING ((auth.jwt() ->> 'role') = 'admin');

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO site_settings (key, value, description)
VALUES 
  ('site_logo', '/src/assets/sendbad.png', 'Site logo URL'),
  ('site_title', 'Amal Pharmacy', 'Site title'),
  ('primary_color', '#0e7490', 'Primary theme color'),
  ('secondary_color', '#3b82f6', 'Secondary theme color'),
  ('primary_font', 'Inter, sans-serif', 'Primary font family'),
  ('font_size_base', '16px', 'Base font size'),
  ('rtl_default', 'true', 'Default to RTL layout'),
  ('contact_email', 'contact@sandbad.com', 'Contact email address'),
  ('contact_phone', '(123) 456-7890', 'Contact phone number'),
  ('contact_address', '123 Health Street, Medical District', 'Contact address');