-- ====================================================================
-- NOIR PREMIUM FOOD DELIVERY PLATFORM
-- Normalized PostgreSQL Schema with Row Level Security (RLS)
-- Monetary values are stored as INTEGER in PAISE (1 INR = 100 Paise)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'restaurant_owner', 'delivery_partner', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home' CHECK (label IN ('Home', 'Work', 'Other')),
    street_address TEXT NOT NULL,
    landmark TEXT,
    city TEXT NOT NULL DEFAULT 'Mumbai',
    postal_code TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESTAURANTS
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT NOT NULL,
    logo_image TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    rating_count INT DEFAULT 120,
    delivery_time_min INT DEFAULT 25,
    delivery_time_max INT DEFAULT 40,
    delivery_fee INT DEFAULT 4900, -- 49.00 INR
    minimum_order INT DEFAULT 20000, -- 200.00 INR
    price_range TEXT DEFAULT '₹₹₹' CHECK (price_range IN ('₹', '₹₹', '₹₹₹', '₹₹₹₹')),
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Mumbai',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT TRUE,
    opening_time TIME DEFAULT '11:00:00',
    closing_time TIME DEFAULT '23:30:00',
    cuisines TEXT[] DEFAULT ARRAY['Contemporary', 'Gourmet'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESTAURANT USERS
CREATE TABLE IF NOT EXISTS public.restaurant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'manager', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, user_id)
);

-- 5. FOOD CATEGORIES
CREATE TABLE IF NOT EXISTS public.food_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FOOD ITEMS
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.food_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price INT NOT NULL, -- in paise
    compare_at_price INT, -- in paise
    image_url TEXT NOT NULL,
    is_veg BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    spice_level INT DEFAULT 1 CHECK (spice_level BETWEEN 0 AND 3),
    preparation_time_minutes INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, slug)
);

-- 7. FOOD CUSTOMIZATIONS
CREATE TABLE IF NOT EXISTS public.food_customizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'single' CHECK (type IN ('single', 'multiple')),
    is_required BOOLEAN DEFAULT FALSE,
    min_selections INT DEFAULT 0,
    max_selections INT DEFAULT 1,
    options JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ id, name, price, is_default }]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CARTS
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CART ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    selected_customizations JSONB DEFAULT '[]'::jsonb,
    item_price INT NOT NULL,
    total_price INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DELIVERY PARTNERS
CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_type TEXT DEFAULT 'ev' CHECK (vehicle_type IN ('bicycle', 'motorcycle', 'scooter', 'ev')),
    vehicle_number TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    current_latitude DOUBLE PRECISION DEFAULT 19.0760,
    current_longitude DOUBLE PRECISION DEFAULT 72.8777,
    total_deliveries INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    wallet_balance INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE RESTRICT,
    delivery_partner_id UUID REFERENCES public.delivery_partners(id) ON DELETE SET NULL,
    delivery_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    delivery_address_snapshot JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
    subtotal_amount INT NOT NULL,
    delivery_fee INT NOT NULL DEFAULT 0,
    tax_amount INT NOT NULL DEFAULT 0,
    discount_amount INT NOT NULL DEFAULT 0,
    total_amount INT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay', 'cod')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    special_instructions TEXT,
    estimated_delivery_time TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE RESTRICT,
    food_name TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price INT NOT NULL,
    total_price INT NOT NULL,
    selected_customizations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. DELIVERIES
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    delivery_partner_id UUID NOT NULL REFERENCES public.delivery_partners(id) ON DELETE CASCADE,
    pickup_time TIMESTAMPTZ,
    delivered_time TIMESTAMPTZ,
    distance_km NUMERIC(4, 2) DEFAULT 3.2,
    delivery_fee_earned INT DEFAULT 4500,
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'picked_up', 'en_route', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
    discount_value INT NOT NULL, -- Percentage (e.g. 20 for 20%) or Flat paise (e.g. 10000 for ₹100)
    min_order_amount INT DEFAULT 29900,
    max_discount_amount INT DEFAULT 15000,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
    usage_limit INT DEFAULT 1000,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('restaurant', 'food_item')),
    entity_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_id)
);

-- 18. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'order' CHECK (type IN ('order', 'promo', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON public.restaurants(city);
CREATE INDEX IF NOT EXISTS idx_food_items_restaurant ON public.food_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_food_items_category ON public.food_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_partner ON public.deliveries(delivery_partner_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public can read restaurants, food items, categories, reviews, coupons
CREATE POLICY "Public read restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Public read food categories" ON public.food_categories FOR SELECT USING (true);
CREATE POLICY "Public read food items" ON public.food_items FOR SELECT USING (true);
CREATE POLICY "Public read food customizations" ON public.food_customizations FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);

-- Authenticated users access their own profiles and addresses
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Orders access
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
