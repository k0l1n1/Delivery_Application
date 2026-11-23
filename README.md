# NOIR – Campus & Hostel Food Delivery Platform

A production-quality food delivery web application engineered specifically for **college and university students to order late-night food, mess upgrades, snacks, and beverages directly to their hostel room doorstep**.

Designed in a minimal, luxury black-and-white aesthetic (Apple & Linear inspired).

![NOIR Campus Hostel Food Delivery](https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=1200&q=85)

---

## 1. Tailored for Campus & Hostel Living

Unlike generic restaurant delivery apps, **NOIR Hostel** is optimized for on-campus logistics:

- **Direct Room & Floor Delivery**: Students enter their **Hostel Name** (e.g. *Boys Hostel 2 - Aravali*, *Girls Hostel 1 - Kailash*), **Block/Wing**, **Floor**, and **Room Number**.
- **Student-Friendly Pricing**: Budget-conscious pricing for cheese Maggi, kathi rolls, egg parathas, mess upgrades, and iced coffee (₹40 – ₹190).
- **Exam & Night Owl Hours**: Operating till **4:00 AM** with active campus bicycle runners.
- **Convenient Payment**: Instant Razorpay UPI (Google Pay, PhonePe, Paytm) + Cash or UPI on Room Drop-off.
- **Campus Runner Tip**: Minimal flat ₹10 runner fee (waived on orders over ₹150).

---

## 2. Portals & Personas

Switch instantly with the persistent top **Role Switcher Bar**:

1. **Hostel Student** (`/`):
   - Choose hostel from top location selector
   - Order midnight Maggi, rolls, thalis, and study drinks
   - Real-time room tracking with simulated runner arrival
   - Student profile with saved hostel rooms and 1-click reorder

2. **Canteen Kitchen Manager** (`/restaurant/dashboard`):
   - Real-time kitchen tickets tagged with **Hostel Name, Block & Room Number**
   - Advance ticket statuses: Accept → Cooking & Thermal Seal → Handover to Runner
   - Menu management: Add dishes, change student prices, toggle sold-out

3. **Hostel Floor Runner** (`/delivery/dashboard`):
   - Online/Offline duty toggle
   - Pickup from Student Activity Center (SAC) Canteen
   - Direct drop-off at hostel room doorstep with student call button
   - Daily runner payout wallet & delivery stats

4. **Warden & Dining Admin** (`/admin/dashboard`):
   - Overview of hostel delivery volume per block (BH-1, BH-2, GH-1, Library)
   - Issue student privilege codes (`EXAMNIGHT`, `HOSTELMATE`)
   - Platform audit log and night delivery compliance

---

## 3. Technology Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (Monochrome Black & White palette), Lucide React
- **Payments**: Razorpay UPI & Cards integration + Cash/UPI on Delivery
- **Database**: Supabase PostgreSQL normalized schema with 18 tables + local fallback engine
- **Map Telemetry**: Interactive vector campus route map with moving bicycle runner animation

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
