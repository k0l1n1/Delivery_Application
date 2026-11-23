'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { MOCK_CATEGORIES, MOCK_RESTAURANTS, MOCK_COUPONS } from '@/lib/data/mock-data';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import {
  Search,
  X,
  Tag,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);

  // Flatten all campus food items
  const allFoodItems = useMemo(() => {
    return MOCK_RESTAURANTS.flatMap((r) =>
      (r.items || []).map((item) => ({
        item,
        restaurant: { id: r.id, name: r.name, delivery_fee: r.delivery_fee },
      }))
    );
  }, []);

  // Filter food items
  const filteredItems = useMemo(() => {
    return allFoodItems.filter(({ item }) => {
      if (filterVegOnly && !item.is_veg) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.category_name?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      if (selectedCategory !== 'all') {
        const catObj = MOCK_CATEGORIES.find((c) => c.slug === selectedCategory);
        const catName = catObj?.name.toLowerCase() || selectedCategory.toLowerCase();
        if (item.category_name?.toLowerCase() !== catName) return false;
      }

      return true;
    });
  }, [allFoodItems, searchQuery, selectedCategory, filterVegOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search & Filter Header Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-noir-500">
                Delivering to All Hostels Till 4:00 AM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
              Food Menu
            </h1>
          </div>

          {/* Quick Info Badges */}
          <div className="flex items-center gap-2 text-xs font-mono text-noir-600">
            <span className="bg-noir-100 border border-noir-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-black" /> 10-15m to Room
            </span>
            <span className="bg-noir-100 border border-noir-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-black" /> Direct Room Drop
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Maggi, paneer roll, cold coffee, chicken biryani, thali..."
            className="w-full pl-11 pr-10 py-3 rounded-full border border-noir-300 bg-noir-50 focus:bg-white focus:outline-none focus:border-black text-sm text-black placeholder:text-noir-400 transition-all shadow-subtle"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-noir-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Food Categories Strip & Veg Filter */}
      <div className="flex items-center justify-between gap-4 border-b border-noir-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
            }`}
          >
            All Food ({allFoodItems.length})
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-black text-white'
                  : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Veg Only Switch */}
        <button
          onClick={() => setFilterVegOnly(!filterVegOnly)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-colors flex-shrink-0 ${
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

      {/* Discounts Notice */}
      <div className="p-3.5 rounded-2xl bg-noir-50 border border-noir-200 flex items-center justify-between text-xs text-noir-600">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-noir-200 text-black">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-black">No current discounts</span>
            <p className="text-[11px] text-noir-500">Standard campus canteen menu pricing applies</p>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase bg-white px-2.5 py-1 rounded-full border border-noir-200 text-noir-500">
          Standard Rates
        </span>
      </div>

      {/* Main Food Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-noir-500">
          <span>{filteredItems.length} Food Dishes Available for Room Delivery</span>
          {filterVegOnly && <span className="text-emerald-700 font-bold">Showing Pure Veg Only</span>}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(({ item, restaurant }) => (
              <FoodItemCard key={item.id} item={item} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-noir-50 rounded-3xl border border-noir-200 space-y-3">
            <p className="font-bold text-black">No food items found matching your filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterVegOnly(false);
              }}
              className="px-5 py-2 rounded-full bg-black text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
