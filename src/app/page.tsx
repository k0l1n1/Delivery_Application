'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_CATEGORIES, MOCK_RESTAURANTS } from '@/lib/data/mock-data';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import {
  Search,
  X,
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const handleUrlCategory = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        if (cat && ['combo', 'non-veg', 'veg', 'drinks', 'snacks', 'all'].includes(cat)) {
          setSelectedCategory(cat);
        }
      }
    };

    handleUrlCategory();
    window.addEventListener('popstate', handleUrlCategory);
    return () => window.removeEventListener('popstate', handleUrlCategory);
  }, []);

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
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white transition-colors">
            Food Menu
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400 dark:text-noir-500 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu..."
            className="w-full pl-11 pr-12 py-3 rounded-2xl border border-noir-200 dark:border-noir-800 bg-noir-50/70 dark:bg-[#111111] focus:bg-white dark:focus:bg-[#0A0A0A] focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white text-sm text-black dark:text-white placeholder:text-noir-400 dark:placeholder:text-noir-500 transition-all shadow-2xs"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-noir-400 hover:text-black dark:hover:text-white p-0.5 rounded-full hover:bg-noir-200 dark:hover:bg-noir-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center text-[10px] font-mono text-noir-400 dark:text-noir-600 bg-white dark:bg-[#161616] border border-noir-200 dark:border-noir-800 px-1.5 py-0.5 rounded shadow-2xs select-none">
              /
            </span>
          )}
        </div>
      </div>

      {/* Food Categories Strip */}
      <div className="border-b border-noir-200/80 dark:border-noir-800/80 pb-3 transition-colors">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'bg-white dark:bg-[#121212] text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white border border-noir-200 dark:border-noir-800 hover:border-noir-300 dark:hover:border-noir-700'
            }`}
          >
            All
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-white dark:bg-[#121212] text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white border border-noir-200 dark:border-noir-800 hover:border-noir-300 dark:hover:border-noir-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Food Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-noir-500 dark:text-noir-400">
          <span>
            <strong className="text-black dark:text-white font-semibold">{filteredItems.length}</strong> Dishes Available for Delivery
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-noir-500 hover:text-black dark:text-noir-400 dark:hover:text-white transition-colors"
            >
              Clear filter ×
            </button>
          )}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(({ item, restaurant }) => (
              <FoodItemCard key={item.id} item={item} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-noir-50 dark:bg-noir-900 rounded-3xl border border-noir-200 dark:border-noir-800 space-y-3">
            <p className="font-bold text-black dark:text-white">No food items found matching your filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
