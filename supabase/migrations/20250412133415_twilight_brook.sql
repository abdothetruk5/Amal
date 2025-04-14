/*
  # Product Categories and Subcategories Schema

  1. New Tables
    - `product_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `parent_id` (uuid, self-referential foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to Existing Tables
    - Add `category_id` to `products` table
    - Update category column to reference new categories table

  3. Security
    - Enable RLS on new table
    - Add policies for public read access
*/

-- Create product categories table
CREATE TABLE IF NOT EXISTS product_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    parent_id uuid REFERENCES product_categories(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(slug)
);

-- Enable RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Anyone can view product categories"
    ON product_categories
    FOR SELECT
    USING (true);

-- Add category_id to products table
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES product_categories(id);

-- Insert main categories
INSERT INTO product_categories (name, slug, description) VALUES
    ('Prescription Medications', 'prescription-medications', 'Medications that require a valid prescription'),
    ('Over-the-Counter (OTC)', 'otc', 'Medications available without a prescription'),
    ('Personal Care', 'personal-care', 'Personal hygiene and beauty products'),
    ('Medical Supplies', 'medical-supplies', 'Healthcare equipment and supplies'),
    ('Wellness & Vitamins', 'wellness-vitamins', 'Supplements and wellness products'),
    ('Home Health', 'home-health', 'Products for home healthcare needs');

-- Insert subcategories for Prescription Medications
WITH prescription_id AS (
    SELECT id FROM product_categories WHERE slug = 'prescription-medications' LIMIT 1
)
INSERT INTO product_categories (name, slug, description, parent_id) VALUES
    ('Antibiotics', 'antibiotics', 'Medications for bacterial infections', (SELECT id FROM prescription_id)),
    ('Cardiovascular', 'cardiovascular', 'Heart and blood pressure medications', (SELECT id FROM prescription_id)),
    ('Diabetes', 'diabetes', 'Diabetes management medications', (SELECT id FROM prescription_id)),
    ('Pain Management', 'pain-management', 'Pain relief medications', (SELECT id FROM prescription_id)),
    ('Mental Health', 'mental-health', 'Mental health medications', (SELECT id FROM prescription_id));

-- Insert subcategories for OTC
WITH otc_id AS (
    SELECT id FROM product_categories WHERE slug = 'otc' LIMIT 1
)
INSERT INTO product_categories (name, slug, description, parent_id) VALUES
    ('Pain Relief', 'pain-relief', 'Non-prescription pain relievers', (SELECT id FROM otc_id)),
    ('Cold & Flu', 'cold-flu', 'Cold and flu remedies', (SELECT id FROM otc_id)),
    ('Allergy', 'allergy', 'Allergy relief medications', (SELECT id FROM otc_id)),
    ('Digestive Health', 'digestive-health', 'Digestive aids and treatments', (SELECT id FROM otc_id)),
    ('First Aid', 'first-aid', 'First aid and wound care', (SELECT id FROM otc_id));

-- Insert subcategories for Personal Care
WITH personal_care_id AS (
    SELECT id FROM product_categories WHERE slug = 'personal-care' LIMIT 1
)
INSERT INTO product_categories (name, slug, description, parent_id) VALUES
    ('Skin Care', 'skin-care', 'Skin care products', (SELECT id FROM personal_care_id)),
    ('Oral Care', 'oral-care', 'Dental and oral hygiene products', (SELECT id FROM personal_care_id)),
    ('Hair Care', 'hair-care', 'Hair care products', (SELECT id FROM personal_care_id)),
    ('Eye Care', 'eye-care', 'Contact lens solutions and eye care', (SELECT id FROM personal_care_id)),
    ('Baby Care', 'baby-care', 'Baby health and hygiene products', (SELECT id FROM personal_care_id));

-- Insert subcategories for Medical Supplies
WITH medical_supplies_id AS (
    SELECT id FROM product_categories WHERE slug = 'medical-supplies' LIMIT 1
)
INSERT INTO product_categories (name, slug, description, parent_id) VALUES
    ('Bandages & Dressings', 'bandages-dressings', 'Wound care supplies', (SELECT id FROM medical_supplies_id)),
    ('Diabetes Supplies', 'diabetes-supplies', 'Diabetes testing and management supplies', (SELECT id FROM medical_supplies_id)),
    ('Mobility Aids', 'mobility-aids', 'Walkers, canes, and mobility assistance', (SELECT id FROM medical_supplies_id)),
    ('Medical Equipment', 'medical-equipment', 'Healthcare monitoring devices', (SELECT id FROM medical_supplies_id)),
    ('Braces & Supports', 'braces-supports', 'Body braces and support equipment', (SELECT id FROM medical_supplies_id));

-- Insert subcategories for Wellness & Vitamins
WITH wellness_id AS (
    SELECT id FROM product_categories WHERE slug = 'wellness-vitamins' LIMIT 1
)
INSERT INTO product_categories (name, slug, description, parent_id) VALUES
    ('Vitamins', 'vitamins', 'Essential vitamins and minerals', (SELECT id FROM wellness_id)),
    ('Supplements', 'supplements', 'Dietary and nutritional supplements', (SELECT id FROM wellness_id)),
    ('Herbal Remedies', 'herbal-remedies', 'Natural and herbal supplements', (SELECT id FROM wellness_id)),
    ('Sports Nutrition', 'sports-nutrition', 'Athletic performance and recovery', (SELECT id FROM wellness_id)),
    ('Weight Management', 'weight-management', 'Weight control and management products', (SELECT id FROM wellness_id));

-- Insert subcategories for Home Health
WITH home_health_id AS (
    SELECT id FROM product_categories WHERE slug = 'home-health' LIMIT 1
)
INSERT INTO product_categories (name, slug, description, parent_id) VALUES
    ('Home Tests', 'home-tests', 'At-home testing kits', (SELECT id FROM home_health_id)),
    ('Sleep & Snoring', 'sleep-snoring', 'Sleep aids and anti-snoring products', (SELECT id FROM home_health_id)),
    ('Bathroom Safety', 'bathroom-safety', 'Safety equipment for bathrooms', (SELECT id FROM home_health_id)),
    ('Daily Living Aids', 'daily-living-aids', 'Aids for everyday activities', (SELECT id FROM home_health_id)),
    ('Air Care', 'air-care', 'Air purifiers and humidifiers', (SELECT id FROM home_health_id));

-- Create trigger for updating timestamps
CREATE TRIGGER update_product_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();