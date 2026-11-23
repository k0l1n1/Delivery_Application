'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MOCK_CATEGORIES, MOCK_RESTAURANTS, MOCK_COUPONS } from '@/lib/data/mock-data';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import {
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  Truck,
  Award,
  ChevronRight,
  Star,
  Quote,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Trending signature dishes from the first few restaurants
  const trendingDishes = MOCK_RESTAURANTS.flatMap((r) =>
    (r.items || []).filter((item) => item.is_popular).map((item) => ({
      item,
      restaurant: { id: r.id, name: r.name, delivery_fee: r.delivery_fee },
    }))
  ).slice(0, 4);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-noir-200 bg-noir-50 text-xs font-mono tracking-wider uppercase text-noir-800">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>A New Standard in Gastronomic Logistics</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-black uppercase leading-[0.95]">
              Good food.
              <br />
              <span className="text-noir-400">Delivered</span>
              <br />
              differently.
            </h1>

            <p className="text-base sm:text-lg text-noir-600 max-w-xl font-normal leading-relaxed">
              Discover exceptional food from the best restaurants around you. Handcrafted flavors, insulated thermal
              transit, and white-glove arrival.
            </p>

            {/* Quick Search Form */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-md">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-noir-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter restaurant, dish or cuisine..."
                  className="w-full pl-12 pr-28 py-4 rounded-full border border-noir-300 bg-noir-50 focus:bg-white focus:outline-none focus:border-black text-sm text-black placeholder:text-noir-400 transition-all shadow-subtle"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold tracking-wide transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/restaurants"
                className="px-8 py-4 rounded-full bg-black text-white hover:bg-noir-800 transition-colors text-sm font-semibold tracking-wide flex items-center gap-2 shadow-sm"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/restaurants?category=burgers"
                className="px-6 py-4 rounded-full border border-noir-200 bg-white hover:bg-noir-50 transition-colors text-sm font-semibold text-black"
              >
                Artisanal Burgers
              </Link>
            </div>

            {/* Micro stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-noir-200 max-w-md">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-black">4.9★</p>
                <p className="text-[11px] font-mono text-noir-500 uppercase">Avg. Gourmet Rating</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-black">28m</p>
                <p className="text-[11px] font-mono text-noir-500 uppercase">Avg. Delivery Pace</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-black">100%</p>
                <p className="text-[11px] font-mono text-noir-500 uppercase">Sealed Vault Packaging</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Mosaic */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[480px] sm:h-[540px] w-full rounded-3xl overflow-hidden border border-noir-200 shadow-elevated">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85"
                alt="Signature culinary masterpiece"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-noir-200 text-black shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 rounded-full">
                      Spotlight Atelier
                    </span>
                    <h3 className="font-bold text-sm mt-1">L&apos;Atelier Noir</h3>
                    <p className="text-xs text-noir-500">Charcoal Smoked Cod & Robata</p>
                  </div>
                  <Link
                    href="/restaurants/latelier-noir"
                    className="p-2.5 rounded-full bg-black text-white hover:scale-105 transition-transform"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOOD CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-noir-500">Curated Cuisines</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black mt-1">
              Explore by Culinary Category
            </h2>
          </div>
          <Link
            href="/restaurants"
            className="text-xs font-semibold text-noir-600 hover:text-black flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/restaurants?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-noir-200 bg-white hover:border-black transition-smooth shadow-subtle p-3 flex flex-col items-center text-center"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-noir-100 group-hover:scale-105 transition-smooth">
                <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="96px" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-black group-hover:text-noir-800">{cat.name}</h3>
              <p className="text-[11px] text-noir-500 line-clamp-1 mt-0.5">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PROMOTIONAL OFFERS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_COUPONS.slice(0, 2).map((coupon) => (
            <div
              key={coupon.id}
              className="relative rounded-3xl bg-black text-white p-6 sm:p-8 border border-noir-800 overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-white text-black px-2.5 py-0.5 rounded-full font-bold">
                    Promo Code
                  </span>
                  <span className="text-xs text-noir-400 font-mono">Limited Time</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{coupon.code}</h3>
                <p className="text-sm text-noir-300">{coupon.description}</p>
              </div>

              <div className="pt-6 relative z-10 flex items-center justify-between">
                <span className="text-xs font-mono text-noir-400">
                  {coupon.discount_type === 'percentage'
                    ? `${coupon.discount_value}% Discount`
                    : `Flat ₹${coupon.discount_value / 100} Off`}
                </span>
                <Link
                  href="/restaurants"
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-noir-100 transition-colors"
                >
                  Apply at Checkout
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. POPULAR RESTAURANTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-noir-500">Fine Dining Ateliers</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black mt-1">
              Top Rated Restaurants
            </h2>
          </div>
          <Link
            href="/restaurants"
            className="text-xs font-semibold text-noir-600 hover:text-black flex items-center gap-1 transition-colors"
          >
            <span>Explore All 24+</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_RESTAURANTS.slice(0, 3).map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 5. TRENDING DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-noir-50 py-12 rounded-3xl border border-noir-200">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-noir-500">Chef Signatures</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black mt-1">
            Trending Dishes Right Now
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingDishes.map(({ item, restaurant }) => (
            <FoodItemCard key={item.id} item={item} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 6. HOW NOIR WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-noir-500">Seamless Precision</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mt-2">
            The NOIR Standard
          </h2>
          <p className="text-sm text-noir-600 mt-2">
            Every step is engineered to safeguard texture, aroma, and temperature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-noir-200 space-y-4 shadow-subtle hover:border-black transition-smooth">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-black">Curated Culinary Selection</h3>
            <p className="text-xs text-noir-500 leading-relaxed">
              We exclusively onboard acclaimed culinary establishments with proven standards in ingredient integrity
              and craftsmanship.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-noir-200 space-y-4 shadow-subtle hover:border-black transition-smooth">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-black">Insulated Thermal Transit</h3>
            <p className="text-xs text-noir-500 leading-relaxed">
              Dishes travel in custom hermetic compartments, preserving the chef&apos;s envisioned crispness and temperature
              until your doorbell rings.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-noir-200 space-y-4 shadow-subtle hover:border-black transition-smooth">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-black">White-Glove Delivery</h3>
            <p className="text-xs text-noir-500 leading-relaxed">
              Professional, dedicated delivery partners equipped with electric vehicles guarantee rapid, discreet,
              and tamper-proof drop-offs.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-black text-white border border-noir-800">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <Quote className="w-10 h-10 text-noir-600 mx-auto" />
            <p className="text-lg sm:text-2xl font-light tracking-wide leading-relaxed">
              &ldquo;NOIR has redefined what delivery can be. The Black Diamond Truffle Pizza arrived piping hot, with the
              crust crusty and fior di latte intact. It feels like having a private chef across the city.&rdquo;
            </p>
            <div className="pt-2">
              <p className="font-bold text-sm tracking-wide">Dr. Kabir Sen</p>
              <p className="text-xs text-noir-400 font-mono">Bandra Kurla Complex, Mumbai</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
