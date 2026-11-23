# MILLET CAFE – Organic & Wholesome Food Delivery Platform

A production-quality food delivery web application engineered for **ordering wholesome millet bowls, stone-ground ragi wraps, bajra burgers, fresh cold-pressed brews, and healthy meals**.

Designed in a minimal, luxury black-and-white aesthetic (Apple & Linear inspired).

![MILLET CAFE](https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=85)

---

## 1. Tailored for Modern Food Ordering

- **Minimalist Monochrome UI**: Clean Apple/Linear inspired black & white aesthetic with refined typography and micro-interactions.
- **Organic & Wholesome Menu**: Foxtail millet bowls, stone-ground ragi wraps, pearl millet burgers, artisanal brews, and guilt-free snacks.
- **Convenient Payment**: Instant Razorpay UPI (Google Pay, PhonePe, Paytm) + Cash or UPI on Delivery.
- **Doorstep & Desk Delivery**: Select delivery location, enter building/wing and desk/room number.

---

## 2. Portals & Dashboards

1. **Food Menu & Ordering** (`/`):
   - Choose location from top location selector
   - Filter by categories or Veg Only
   - Instant search and customizable items
   - Seamless cart and Razorpay checkout
   - Real-time order tracking with animated courier telemetry

2. **Kitchen Manager** (`/restaurant/dashboard`):
   - Real-time kitchen tickets tagged with delivery location and desk
   - Advance ticket statuses: Accept → Cooking & Thermal Seal → Handover to Courier
   - Menu management: Add dishes, change prices, toggle availability

3. **Delivery Courier** (`/delivery/dashboard`):
   - Online/Offline duty toggle
   - Pickup from Central Hub kitchen
   - Direct drop-off at destination with recipient call button
   - Courier payout records & delivery stats

4. **Platform Administration** (`/admin/dashboard`):
   - Overview of campus delivery volume per block
   - Promotional coupon management
   - Platform audit log and compliance

---

## 3. Technology Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (Monochrome Black & White palette), Lucide React
- **Payments**: Razorpay UPI & Cards integration + Cash/UPI on Delivery
- **Database**: Supabase PostgreSQL schema with local fallback engine
- **Map Telemetry**: Interactive vector route map with moving courier animation

---

## 4. Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 5. Deployment

Ready for zero-config deployment on **Vercel** with **Supabase**.
Configure environment variables using `.env.example`.
