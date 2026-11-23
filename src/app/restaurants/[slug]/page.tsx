'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_RESTAURANTS } from '@/lib/data/mock-data';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import { formatCurrency } from '@/lib/utils';
import {
  Star,
  Clock,
  Bike,
  ShieldCheck,
  ChevronLeft,
  MapPin,
} from 'lucide-react';

export default function RestaurantDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const restaurant = MOCK_RESTAURANTS.find((r) => r.slug === slug) || MOCK_RESTAURANTS[0];
  const [activeMenuTab, setActiveMenuTab] = useState<string>('all');
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);

  // Extract menu category names
  const menuCategories = Array.from(
    new Set((restaurant.items || []).map((i) => i.category_name || 'Signatures'))
  );

  const displayedItems = (restaurant.items || []).filter((item) => {
    if (filterVegOnly && !item.is_veg) return false;
    if (activeMenuTab !== 'all' && (item.category_name || 'Signatures') !== activeMenuTab) {
      return false;
    }
    return true;
  });

  return (
    <div className="pb-24">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-noir-600 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Restaurants
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-noir-900 overflow-hidden">
        <Image
          src={restaurant.cover_image}
          alt={restaurant.name}
          fill
          priority
          className="object-cover opacity-85"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-white/20">
              {restaurant.price_range}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Certified Atelier
            </span>
            <span className="bg-white text-black text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-black text-black" /> {restaurant.rating.toFixed(2)} ({restaurant.rating_count} reviews)
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{restaurant.name}</h1>
          <p className="text-xs sm:text-sm text-noir-300 max-w-2xl mt-1 line-clamp-2">
            {restaurant.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-white/20 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-noir-400" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-noir-400" />
              <span>
                {restaurant.delivery_time_min}-{restaurant.delivery_time_max} mins • Open until {restaurant.closing_time}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5 text-noir-400" />
              <span>Delivery {formatCurrency(restaurant.delivery_fee)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Menu Navigation Bar */}
      <div className="sticky top-[108px] z-30 bg-white/95 backdrop-blur-md border-b border-noir-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Menu Categories */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setActiveMenuTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeMenuTab === 'all'
                  ? 'bg-black text-white'
                  : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
              }`}
            >
              Full Menu ({restaurant.items?.length || 0})
            </button>
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveMenuTab(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeMenuTab === cat
                    ? 'bg-black text-white'
                    : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pure Veg Toggle */}
          <button
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors flex-shrink-0 ${
              filterVegOnly
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-noir-300 bg-white text-noir-700 hover:bg-noir-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full border border-emerald-600 flex items-center justify-center p-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </span>
            <span>Veg Only</span>
          </button>
        </div>
      </div>

      {/* Menu List Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">
            {activeMenuTab === 'all' ? 'All Dishes' : activeMenuTab}
          </h2>
          <span className="text-xs font-mono text-noir-500">
            {displayedItems.length} items available
          </span>
        </div>

        {displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayedItems.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                restaurant={{
                  id: restaurant.id,
                  name: restaurant.name,
                  delivery_fee: restaurant.delivery_fee,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-noir-50 rounded-2xl border border-noir-200">
            <p className="text-sm font-bold text-black">No dishes match the selected filter.</p>
            <button
              onClick={() => {
                setActiveMenuTab('all');
                setFilterVegOnly(false);
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold bg-black text-white rounded-full hover:bg-noir-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
