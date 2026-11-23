-- ====================================================================
-- NOIR SEED DATA: Premium Restaurants, Menus & Categories
-- ====================================================================

-- Categories
INSERT INTO public.food_categories (id, name, slug, description, image_url, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Burgers', 'burgers', 'Artisanal brioche smash burgers and truffled patties', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 1),
('c1000000-0000-0000-0000-000000000002', 'Pizza', 'pizza', 'Wood-fired sourdough Neapolitan crusts with buffalo mozzarella', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', 2),
('c1000000-0000-0000-0000-000000000003', 'Indian', 'indian', 'Modernized royal Mughlai curries and clay-oven kebabs', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 3),
('c1000000-0000-0000-0000-000000000004', 'Biryani', 'biryani', 'Slow-cooked Dum Biryani infused with Kashmiri saffron', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', 4),
('c1000000-0000-0000-0000-000000000005', 'Japanese', 'japanese', 'Omakase sashimi, nigiri and silky tonkotsu ramen', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80', 5),
('c1000000-0000-0000-0000-000000000006', 'Healthy Food', 'healthy-food', 'Cold-pressed greens, quinoa macro bowls and avocado tartines', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', 6),
('c1000000-0000-0000-0000-000000000007', 'Desserts', 'desserts', 'French viennoiserie, Valrhona chocolate tarts and gelatos', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', 7),
('c1000000-0000-0000-0000-000000000008', 'Beverages', 'beverages', 'Single origin pour-overs, ceremonial matcha and botanical elixirs', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80', 8)
ON CONFLICT (id) DO NOTHING;

-- Demo Restaurants
INSERT INTO public.restaurants (id, name, slug, description, cover_image, rating, rating_count, delivery_time_min, delivery_time_max, delivery_fee, minimum_order, price_range, address, cuisines) VALUES
('r1000000-0000-0000-0000-000000000001', 'L''Atelier Noir', 'latelier-noir', 'Avant-garde French-Japanese culinary fusion and charcoal-fired delicacies.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', 4.95, 340, 25, 35, 6000, 45000, '₹₹₹₹', 'Bandra Kurla Complex, Mumbai', ARRAY['Japanese', 'Modern French', 'Contemporary']),
('r1000000-0000-0000-0000-000000000002', 'Maison Truffle & Crust', 'maison-truffle', 'Authentic 72-hour slow fermented sourdough pizzas with black truffles and San Marzano tomatoes.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 4.88, 512, 30, 40, 4900, 30000, '₹₹₹', 'Pali Hill, Bandra West, Mumbai', ARRAY['Italian', 'Wood-fired Pizza', 'Artisanal']),
('r1000000-0000-0000-0000-000000000003', 'The Royal Dum Co.', 'the-royal-dum-co', 'Heritage Awadhi and Hyderabadi culinary recipes, cooked in sealed earthen handis.', 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80', 4.92, 428, 35, 45, 5500, 35000, '₹₹₹', 'Colaba, Mumbai', ARRAY['Awadhi', 'Biryani', 'Mughlai']),
('r1000000-0000-0000-0000-000000000004', 'Umami & Ember', 'umami-and-ember', 'Wagyu smash burgers on house-baked butter brioche with smoked black garlic aioli.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80', 4.84, 290, 20, 30, 4000, 25000, '₹₹', 'Indiranagar / Bandra, Mumbai', ARRAY['Gourmet Burgers', 'American', 'Craft Sides']),
('r1000000-0000-0000-0000-000000000005', 'Botanica Greens & Grain', 'botanica-greens', 'Plant-forward nutrient-dense macro bowls, wild cold pressed tonics, and avocado creations.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80', 4.79, 184, 20, 30, 3500, 25000, '₹₹', 'Juhu Beach Road, Mumbai', ARRAY['Healthy', 'Salads', 'Vegan', 'Organic']),
('r1000000-0000-0000-0000-000000000006', 'Noir Pâtisserie & Chocolatier', 'noir-patisserie', 'Bespoke viennoiserie, Parisian macarons, and single-origin dark chocolate creations.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80', 4.96, 610, 15, 25, 4500, 20000, '₹₹₹', 'Kala Ghoda, Mumbai', ARRAY['Desserts', 'Pastry', 'Coffee', 'Chocolates'])
ON CONFLICT (id) DO NOTHING;

-- Demo Coupons
INSERT INTO public.coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount) VALUES
('cp100000-0000-0000-0000-000000000001', 'NOIRWELCOME', 'Enjoy 20% off on your debut order', 'percentage', 20, 30000, 15000),
('cp100000-0000-0000-0000-000000000002', 'BLACKCARD', 'Flat ₹200 off for members on gourmet selections', 'flat', 20000, 50000, 20000)
ON CONFLICT (id) DO NOTHING;
