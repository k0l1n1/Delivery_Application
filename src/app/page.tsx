'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_CATEGORIES, MOCK_RESTAURANTS } from '@/lib/data/mock-data';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import {
  Search,
  X,
  Tag,
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.category_name?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      if (selectedCategory === 'all') return true;

      if (selectedCategory === 'combo') {
        return (
          item.category_name?.toLowerCase() === 'combo' ||
          item.slug.includes('combo') ||
          item.name.toLowerCase().includes('combo')
        );
      }

      if (selectedCategory === 'non-veg') {
        return !item.is_veg || item.category_name?.toLowerCase() === 'non veg';
      }

      if (selectedCategory === 'veg') {
        return item.is_veg || item.category_name?.toLowerCase() === 'veg';
      }

      if (selectedCategory === 'drinks') {
        return (
          item.category_name?.toLowerCase() === 'drinks' ||
          item.slug.includes('brew') ||
          item.slug.includes('juice') ||
          item.slug.includes('detox') ||
          item.slug.includes('coffee') ||
          item.slug.includes('tea') ||
          item.slug.includes('buttermilk') ||
          item.slug.includes('chaas') ||
          item.name.toLowerCase().includes('brew') ||
          item.name.toLowerCase().includes('juice') ||
          item.name.toLowerCase().includes('tea') ||
          item.name.toLowerCase().includes('coffee')
        );
      }

      if (selectedCategory === 'snacks') {
        return (
          item.category_name?.toLowerCase() === 'snacks' ||
          item.slug.includes('wrap') ||
          item.slug.includes('roll') ||
          item.slug.includes('burger') ||
          item.slug.includes('brownie') ||
          item.slug.includes('snack') ||
          item.slug.includes('tikka') ||
          item.name.toLowerCase().includes('wrap') ||
          item.name.toLowerCase().includes('roll') ||
          item.name.toLowerCase().includes('burger') ||
          item.name.toLowerCase().includes('brownie') ||
          item.name.toLowerCase().includes('snack')
        );
      }

      return true;
    });
  }, [allFoodItems, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
          Food Menu
        </h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu..."
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

      {/* Food Categories Strip */}
      <div className="border-b border-noir-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
            }`}
          >
            All
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
      </div>

      {/* Discounts Notice */}
      <div className="p-3.5 rounded-2xl bg-noir-50 border border-noir-200 flex items-center justify-between text-xs text-noir-600">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-noir-200 text-black">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-black">No current discounts</span>
            <p className="text-[11px] text-noir-500">Standard menu pricing applies across all items</p>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase bg-white px-2.5 py-1 rounded-full border border-noir-200 text-noir-500">
          Standard Rates
        </span>
      </div>

      {/* Main Food Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-noir-500">
          <span>{filteredItems.length} Dishes Available for Delivery</span>
          {selectedCategory !== 'all' && (
            <span className="text-black font-semibold capitalize">Filter: {selectedCategory.replace('-', ' ')}</span>
          )}
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
