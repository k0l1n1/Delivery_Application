# NOIR – Premium Food Delivery Platform

A production-quality food delivery web application engineered with a minimalist, luxury black-and-white design aesthetic inspired by Apple, Linear, and high-end gastronomic dining.

![NOIR Platform](https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85)

---

## 1. Core Architecture & Technology Stack

### Frontend:
- **Next.js 15 (App Router)** – Server components, client interactivity, and dynamic routing
- **React 19 & TypeScript** – Strict type-safety across database models, cart, and orders
- **Tailwind CSS** – Monochrome color tokens, responsive utilities, and elevation shadows
- **Lucide React** – Minimal iconography
- **Canvas Confetti** – Seamless celebration feedback upon successful checkout

### Backend & API:
- **Next.js Server Actions & Route Handlers** (`/api/payments/razorpay/*`)
- **Node.js Crypto** – Server-side HMAC-SHA256 payment signature verification

### Database & Security:
- **Supabase PostgreSQL** – 18 normalized tables with Row Level Security (RLS)
- **Monetary standard** – Prices stored strictly as integers in **Paise** (1 INR = 100 Paise) to avoid floating-point errors
- **Supabase Realtime & Auth** – Role-based access control with seamless local fallback persistence

### Payments:
- **Razorpay Integration** – Indian payment gateway for Cards, UPI, Netbanking, and Wallets
- **Cash on Delivery (COD)** – Supported with server-side validation

---

## 2. Design System – Premium Monochrome

| Token | Hex Code | Purpose |
|---|---|---|
| Primary Background | `#FFFFFF` | Default page and view background |
| Primary Text | `#000000` | Bold typographic headings and titles |
| Secondary Background | `#F5F5F5` | Subdued surface cards and pills |
| Borders | `#E5E5E5` | Minimal 1px hairline card borders |
| Secondary Text | `#737373` | Subtitles, culinary descriptions, meta information |
| Dark Sections | `#000000` | Footer, highlight banners, primary action buttons |
| Dark Section Text | `#FFFFFF` | High-contrast readable typography |

---

## 3. Application Modules & Portals

### A. Customer Experience
1. **Homepage (`/`)**:
   - Hero: *"GOOD FOOD. DELIVERED DIFFERENTLY."*
   - Location Selector (Mumbai, Bengaluru, Delhi)
   - Food Categories (Burgers, Pizza, Indian, Chinese, Biryani, Desserts, Healthy Food, Beverages, Bakery, Fast Food)
   - Curated Restaurants and Trending Dishes
   - Promo vouchers (`NOIRFIRST`, `BLACKCARD`)
   - 3-Step NOIR Standard: Selection, Thermal Transit, White-glove delivery
   - Customer Testimonials

2. **Restaurant Discovery (`/restaurants`)**:
   - Search by restaurant name, food item, or cuisine
   - Dynamic filters: Cuisine category, price range (`₹` to `₹₹₹₹`), minimum rating (4.5★, 4.8★, 4.9★), and max delivery time
   - Sorting: Most Popular, Highest Rated, Fastest Delivery

3. **Restaurant Detail (`/restaurants/[slug]`)**:
   - Atelier cover image, delivery pace, rating, cuisine list, and operating hours
   - Interactive category tabs and *Veg Only* dietary toggle
   - Dish customization modal: portion sizes, toppings, crusts, and accompaniments

4. **Shopping Cart (`/cart`)**:
   - Real-time subtotal, GST (5%), delivery fees (free on orders > ₹1,500), and coupon discount
   - Quantity adjustment stepper with multi-restaurant conflict prevention

5. **Checkout Experience (`/checkout`)**:
   - Multi-residence address selector & "Add New Residence" modal
   - Special chef and gate delivery instructions
   - Payment selection: Razorpay (Cards / UPI / NetBanking) or Cash on Delivery
   - Server-side cryptographic signature verification

6. **Live Order Tracking (`/orders/[id]`)**:
   - 6 Live Statuses: `placed` → `confirmed` → `preparing` → `ready` → `out_for_delivery` → `delivered`
   - Real-time Status Simulator controls for immediate testing
   - Interactive route map showing moving courier EV marker between atelier and residence
   - Courier contact details and direct dial

7. **Customer Profile (`/profile`)**:
   - Registered residences management
   - Complete order history with one-click **Reorder** functionality

---

### B. Role-Based Dashboards

Switch instantly between roles using the persistent **Role Switcher Bar** at the top of every page:

1. **Restaurant Owner Dashboard (`/restaurant/dashboard`)**:
   - Real-time incoming kitchen order tickets
   - Advance order stages (`Accept` → `Prepare` → `Ready for Pickup`)
   - Menu Catalogue management: Add new dishes, edit prices, toggle item availability (in-stock / sold out), delete items
   - Sales velocity charts and revenue analytics

2. **Delivery Partner Dashboard (`/delivery/dashboard`)**:
   - Online / Offline availability toggle switch
   - Active dispatch assignments with restaurant pickup and residence drop-off coordinates
   - One-click status triggers: Confirm pickup and mark delivered
   - Payout wallet balance & completed trip history

3. **Platform Admin Governance (`/admin/dashboard`)**:
   - Platform KPIs: GMV, net commission revenue (15%), verified ateliers, electric couriers, and total orders
   - Restaurant verification & approval
   - Promotional coupon manager: create percentage or flat rupee discount codes
   - Complete platform audit log table

---

## 4. Database Schema (`supabase/schema.sql`)

The database contains 18 normalized tables:
- `profiles`
- `addresses`
- `restaurants`
- `restaurant_users`
- `food_categories`
- `food_items`
- `food_customizations`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `payments`
- `delivery_partners`
- `deliveries`
- `reviews`
- `coupons`
- `favorites`
- `notifications`

### Applying to Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and execute `supabase/schema.sql`.
4. Paste and execute `supabase/seed.sql` to populate initial restaurants and menus.

---

## 5. Local Setup & Installation

### Prerequisites:
- Node.js 18+ (tested on Node 20 / 24)
- npm or pnpm

### Steps:
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (optional for local mock mode)
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 6. Deployment to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Click **Deploy**.
