export type UserRole = 'customer' | 'restaurant_owner' | 'delivery_partner' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  roll_number?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string; // 'Room Address' | 'Library' | 'Lab' | 'Hostel'
  hostel_name: string; // e.g. "Boys Hostel 2 (Satpura)", "Girls Hostel 1 (Nilgiri)"
  block_wing: string; // e.g. "Block B", "Wing 3"
  room_number: string; // e.g. "Room 304"
  floor?: string; // e.g. "3rd Floor"
  street_address?: string; // formatted summary
  landmark?: string;
  city?: string;
  postal_code?: string;
  is_default: boolean;
  created_at?: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price_in_paise: number;
  is_default?: boolean;
}

export interface FoodCustomization {
  id: string;
  food_item_id: string;
  name: string;
  type: 'single' | 'multiple';
  is_required: boolean;
  min_selections?: number;
  max_selections?: number;
  options: CustomizationOption[];
}

export interface FoodItem {
  id: string;
  restaurant_id: string;
  category_id?: string;
  category_name?: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in paise (e.g. 8000 for ₹80)
  compare_at_price?: number; // in paise
  image_url: string;
  is_veg: boolean;
  is_available: boolean;
  is_popular?: boolean;
  spice_level?: number;
  preparation_time_minutes?: number;
  customizations?: FoodCustomization[];
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  logo_image?: string;
  rating: number;
  rating_count: number;
  delivery_time_min: number;
  delivery_time_max: number;
  delivery_fee: number; // in paise
  minimum_order: number; // in paise
  price_range: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  is_verified: boolean;
  opening_time?: string;
  closing_time?: string;
  cuisines: string[];
  items?: FoodItem[];
}

export interface CartItemOption {
  group_name: string;
  option_id: string;
  option_name: string;
  price_in_paise: number;
}

export interface CartItem {
  id: string;
  food_item_id: string;
  restaurant_id: string;
  restaurant_name: string;
  name: string;
  image_url: string;
  is_veg: boolean;
  unit_price: number; // in paise
  base_price: number; // in paise
  quantity: number;
  selected_customizations: CartItemOption[];
  total_price: number; // in paise
  special_notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number; // percentage (e.g. 20) or paise (e.g. 5000)
  min_order_amount: number; // in paise
  max_discount_amount?: number; // in paise
  valid_until?: string;
  is_active: boolean;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  food_item_id: string;
  food_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_customizations: CartItemOption[];
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicle_type: 'bicycle' | 'motorcycle' | 'scooter' | 'ev';
  vehicle_number: string;
  rating: number;
  avatar_url?: string;
  current_latitude?: number;
  current_longitude?: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_phone?: string;
  student_roll_no?: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_address?: string;
  restaurant_cover?: string;
  delivery_partner_id?: string;
  delivery_partner?: DeliveryPartner;
  delivery_address: Address;
  status: OrderStatus;
  subtotal_amount: number; // in paise
  delivery_fee: number; // in paise
  tax_amount: number; // in paise
  discount_amount: number; // in paise
  total_amount: number; // in paise
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  special_instructions?: string;
  items: OrderItem[];
  estimated_delivery_time?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}
