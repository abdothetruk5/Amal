/*
  # Add product sorting fields

  1. New Columns
    - `rating` (numeric) - Average product rating
    - `effectiveness` (numeric) - Product effectiveness score
    - `popularity` (integer) - Number of times product has been purchased
    - Added indexes for efficient sorting

  2. Changes
    - Added new columns to products table
    - Created indexes for sorting performance
*/

-- Add new columns for sorting
ALTER TABLE products
ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN IF NOT EXISTS effectiveness numeric DEFAULT 0 CHECK (effectiveness >= 0 AND effectiveness <= 100),
ADD COLUMN IF NOT EXISTS popularity integer DEFAULT 0 CHECK (popularity >= 0);

-- Create indexes for efficient sorting
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_effectiveness ON products(effectiveness);
CREATE INDEX IF NOT EXISTS idx_products_popularity ON products(popularity);