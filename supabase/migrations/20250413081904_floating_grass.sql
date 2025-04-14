/*
  # Add Sample Product Data

  1. Changes
    - Insert sample products with detailed descriptions, prices, and ratings
    - Update category references in products
    - Add realistic product data for the pharmacy app
*/

-- Update existing products with categories
UPDATE products
SET category_id = (SELECT id FROM product_categories WHERE slug = 'pain-relief' LIMIT 1)
WHERE category = 'Pain Relief';

UPDATE products
SET category_id = (SELECT id FROM product_categories WHERE slug = 'vitamins' LIMIT 1)
WHERE category = 'Vitamins';

UPDATE products
SET category_id = (SELECT id FROM product_categories WHERE slug = 'first-aid' LIMIT 1)
WHERE category = 'First Aid';

UPDATE products
SET category_id = (SELECT id FROM product_categories WHERE slug = 'skin-care' LIMIT 1)
WHERE category = 'Skincare';

UPDATE products
SET category_id = (SELECT id FROM product_categories WHERE slug = 'oral-care' LIMIT 1)
WHERE category = 'Dental Care';

-- Insert more sample products for different categories
INSERT INTO products (name, description, price, image_url, category, stock, rating, effectiveness, popularity, category_id)
VALUES
  -- Pain Relief Products
  ('Premium Pain Relief Tablets', 'Fast-acting pain relief for headaches, muscle pain, and minor arthritis. Relief lasts up to 12 hours.', 12.99, 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFpbiUyMHJlbGllZnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60', 'Pain Relief', 150, 4.8, 95, 1250, (SELECT id FROM product_categories WHERE slug = 'pain-relief' LIMIT 1)),
  
  ('Muscle Recovery Gel', 'Cooling gel formula for deep muscle pain relief. Contains natural menthol for long-lasting comfort.', 15.50, 'https://images.unsplash.com/photo-1616671276441-2f2d1fc533a0?auto=format&fit=crop&q=80&w=800&h=800', 'Pain Relief', 85, 4.6, 90, 980, (SELECT id FROM product_categories WHERE slug = 'pain-relief' LIMIT 1)),
  
  ('Thermal Pain Relief Patch', 'Heat therapy patch delivers consistent relief for up to 8 hours. Ideal for back pain and muscle strains.', 8.99, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800&h=800', 'Pain Relief', 200, 4.7, 88, 1100, (SELECT id FROM product_categories WHERE slug = 'pain-relief' LIMIT 1)),

  -- Vitamin Products
  ('Vitamin D3 + K2 Complex', 'Essential vitamins to support bone health, immune function, and calcium absorption. 90 soft gels.', 24.95, 'https://images.unsplash.com/photo-1584308074727-e93a698bedf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dml0YW1pbnN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60', 'Vitamins', 120, 4.7, 85, 890, (SELECT id FROM product_categories WHERE slug = 'vitamins' LIMIT 1)),
  
  ('Multivitamin Daily Complex', 'Complete multivitamin with 23 essential nutrients for overall health. Supports energy and immunity.', 19.95, 'https://images.unsplash.com/photo-1577613901972-9106e25d0fa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dml0YW1pbnN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60', 'Vitamins', 180, 4.9, 92, 1450, (SELECT id FROM product_categories WHERE slug = 'vitamins' LIMIT 1)),
  
  ('Vitamin C with Zinc', 'Powerful immune support with 1000mg of Vitamin C and Zinc. Supports immune health year-round.', 16.99, 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?auto=format&fit=crop&q=80&w=800&h=800', 'Vitamins', 200, 4.8, 94, 1320, (SELECT id FROM product_categories WHERE slug = 'vitamins' LIMIT 1)),

  -- First Aid Products
  ('Advanced First Aid Kit', 'Comprehensive kit with essential supplies for emergency situations. Contains 85 pieces.', 35.50, 'https://images.unsplash.com/photo-1585828292920-638a2a78cb38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zmlyc3QlMjBhaWQlMjBraXR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60', 'First Aid', 50, 4.9, 98, 780, (SELECT id FROM product_categories WHERE slug = 'first-aid' LIMIT 1)),
  
  ('Wound Healing Gel', 'Advanced formula that creates a protective barrier while promoting faster healing.', 12.99, 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?auto=format&fit=crop&q=80&w=800&h=800', 'First Aid', 95, 4.5, 89, 650, (SELECT id FROM product_categories WHERE slug = 'first-aid' LIMIT 1)),
  
  ('Sterile Bandage Variety Pack', 'Assorted sizes of sterile bandages for all types of minor cuts and scrapes. Breathable material.', 7.50, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800&h=800', 'First Aid', 150, 4.4, 86, 920, (SELECT id FROM product_categories WHERE slug = 'first-aid' LIMIT 1)),

  -- Skincare Products
  ('Hyaluronic Acid Serum', 'Intensive hydration serum for all skin types. Reduces fine lines and wrinkles.', 29.99, 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c2tpbmNhcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60', 'Skincare', 85, 4.5, 88, 1050, (SELECT id FROM product_categories WHERE slug = 'skin-care' LIMIT 1)),
  
  ('Advanced Repair Moisturizer', 'Rich, nourishing formula that repairs damaged skin and restores moisture barrier.', 22.95, 'https://images.unsplash.com/photo-1556228578-4da87a0aacce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpbmNhcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60', 'Skincare', 100, 4.7, 91, 880, (SELECT id FROM product_categories WHERE slug = 'skin-care' LIMIT 1)),
  
  ('Sun Protection SPF 50', 'Broad-spectrum protection against UVA and UVB rays. Water-resistant and non-greasy.', 18.50, 'https://images.unsplash.com/photo-1594640338984-6de8b4100f5a?auto=format&fit=crop&q=80&w=800&h=800', 'Skincare', 120, 4.8, 95, 760, (SELECT id FROM product_categories WHERE slug = 'skin-care' LIMIT 1)),

  -- Dental Care Products
  ('Advanced Whitening Toothpaste', 'Removes stains and prevents cavities for a brighter, healthier smile.', 8.95, 'https://images.unsplash.com/photo-1559381313-a0509b6f1fad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dG9vdGhwYXN0ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60', 'Dental Care', 200, 4.6, 87, 1200, (SELECT id FROM product_categories WHERE slug = 'oral-care' LIMIT 1)),
  
  ('Sensitive Teeth Relief Gel', 'Fast-acting gel that provides immediate relief for sensitive teeth. Long-lasting protection.', 14.99, 'https://images.unsplash.com/photo-1563633619954-d0fc9e9d43b8?auto=format&fit=crop&q=80&w=800&h=800', 'Dental Care', 75, 4.4, 82, 550, (SELECT id FROM product_categories WHERE slug = 'oral-care' LIMIT 1)),
  
  ('Professional Dental Floss Pack', 'Strong, shred-resistant floss that removes plaque and food particles from between teeth.', 5.99, 'https://images.unsplash.com/photo-1612209992860-9c9dfea1b3b1?auto=format&fit=crop&q=80&w=800&h=800', 'Dental Care', 150, 4.3, 80, 670, (SELECT id FROM product_categories WHERE slug = 'oral-care' LIMIT 1)),

  -- Supplements
  ('Omega-3 Fish Oil', 'Supports heart, brain, and joint health with essential fatty acids. 1000mg softgels.', 19.99, 'https://images.unsplash.com/photo-1577613901972-9106e25d0fa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZmlzaCUyMG9pbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60', 'Supplements', 90, 4.7, 89, 950, (SELECT id FROM product_categories WHERE slug = 'supplements' LIMIT 1)),
  
  ('Probiotics Complex', 'Supports gut health and digestion with 50 billion CFU and 15 probiotic strains.', 26.50, 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=800&h=800', 'Supplements', 65, 4.5, 86, 820, (SELECT id FROM product_categories WHERE slug = 'supplements' LIMIT 1)),
  
  ('Immune Support Complex', 'Blend of vitamins, minerals, and herbs to strengthen the immune system.', 27.50, 'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1tdW5lJTIwc3VwcG9ydHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60', 'Supplements', 110, 4.8, 93, 980, (SELECT id FROM product_categories WHERE slug = 'supplements' LIMIT 1)),

  -- Medical Supplies
  ('Digital Thermometer', 'Fast and accurate temperature readings with LCD display. Suitable for all ages.', 15.75, 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGhlcm1vbWV0ZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60', 'Medical Supplies', 60, 4.3, 85, 600, (SELECT id FROM product_categories WHERE slug = 'medical-equipment' LIMIT 1)),
  
  ('Blood Pressure Monitor', 'Automatic blood pressure monitor with memory function. Easy to use and accurate.', 49.95, 'https://images.unsplash.com/photo-1579154392435-6e8e221fc45c?auto=format&fit=crop&q=80&w=800&h=800', 'Medical Supplies', 40, 4.6, 90, 480, (SELECT id FROM product_categories WHERE slug = 'medical-equipment' LIMIT 1)),
  
  ('Pulse Oximeter', 'Measures blood oxygen saturation levels and pulse rate. Compact and portable design.', 35.99, 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=800&h=800', 'Medical Supplies', 55, 4.7, 92, 520, (SELECT id FROM product_categories WHERE slug = 'medical-equipment' LIMIT 1))
;