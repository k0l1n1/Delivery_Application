'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_RESTAURANTS, MOCK_CATEGORIES } from '@/lib/data/mock-data';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

function RestaurantListingContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'delivery_time'>('popularity');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter & Sort logic
  const filteredRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter((r) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesCuisine = r.cuisines.some((c) => c.toLowerCase().includes(query));
        const matchesItem = r.items?.some((i) => i.name.toLowerCase().includes(query));
        if (!matchesName && !matchesCuisine && !matchesItem) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = MOCK_CATEGORIES.find((c) => c.slug === selectedCategory);
        const catName = catObj?.name.toLowerCase() || selectedCategory.toLowerCase();
        const matchesCuisine = r.cuisines.some((c) => c.toLowerCase().includes(catName));
        const matchesItemCat = r.items?.some(
          (i) => i.category_name?.toLowerCase().includes(catName)
        );
        if (!matchesCuisine && !matchesItemCat) return false;
      }

      // Price filter
      if (selectedPrice !== 'all' && r.price_range !== selectedPrice) {
        return false;
      }

      // Rating filter
      if (selectedRating > 0 && r.rating < selectedRating) {
        return false;
      }

      // Delivery time filter
      if (r.delivery_time_max > maxDeliveryTime) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'delivery_time') {
        return a.delivery_time_min - b.delivery_time_min;
      }
      // popularity (rating_count)
      return b.rating_count - a.rating_count;
    });
  }, [searchQuery, selectedCategory, selectedPrice, selectedRating, maxDeliveryTime, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPrice('all');
    setSelectedRating(0);
    setMaxDeliveryTime(60);
    setSortBy('popularity');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedPrice !== 'all' ||
    selectedRating > 0 ||
    maxDeliveryTime < 60 ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Search Bar */}
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-noir-500">Fine Dining Discovery</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black">
          Gourmet Restaurants
        </h1>
        <p className="text-sm text-noir-600 max-w-xl">
          Order culinary specialties from high-end ateliers, handpicked for excellence.
        </p>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant name, cuisine or dish..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-noir-300 bg-noir-50 focus:bg-white focus:outline-none focus:border-black text-sm text-black placeholder:text-noir-400 transition-all"
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

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort restaurants by"
                className="appearance-none bg-white border border-noir-300 rounded-full pl-4 pr-10 py-3 text-xs font-semibold text-black focus:outline-none focus:border-black cursor-pointer shadow-subtle"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated (4.9+)</option>
                <option value="delivery_time">Fastest Delivery</option>
              </select>
              <ArrowUpDown className="absolute right-3.5 w-3.5 h-3.5 text-noir-500 pointer-events-none" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border text-xs font-semibold transition-colors shadow-subtle ${
                isFilterOpen || hasActiveFilters
                  ? 'border-black bg-black text-white'
                  : 'border-noir-300 bg-white text-black hover:bg-noir-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-black text-white'
              : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
          }`}
        >
          All Categories
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

      {/* Expandable Filter Drawer */}
      {isFilterOpen && (
        <div className="p-6 rounded-2xl border border-noir-200 bg-noir-50 space-y-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-black">Refine Search Parameters</h3>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-noir-600 hover:text-black underline font-mono">
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-noir-500">Price Range</label>
              <div className="flex gap-2">
                {['all', '₹', '₹₹', '₹₹₹', '₹₹₹₹'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPrice(p)}
                    className={`flex-1 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                      selectedPrice === p
                        ? 'border-black bg-black text-white font-bold'
                        : 'border-noir-300 bg-white text-black hover:bg-noir-100'
                    }`}
                  >
                    {p === 'all' ? 'Any' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-noir-500">Minimum Rating</label>
              <div className="flex gap-2">
                {[
                  { label: 'Any', value: 0 },
                  { label: '4.5+', value: 4.5 },
                  { label: '4.8+', value: 4.8 },
                  { label: '4.9+', value: 4.9 },
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setSelectedRating(r.value)}
                    className={`flex-1 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                      selectedRating === r.value
                        ? 'border-black bg-black text-white font-bold'
                        : 'border-noir-300 bg-white text-black hover:bg-noir-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Time Filter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="uppercase text-noir-500">Max Delivery Time</span>
                <span className="font-bold text-black">{maxDeliveryTime} mins</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                step="5"
                value={maxDeliveryTime}
                onChange={(e) => setMaxDeliveryTime(Number(e.target.value))}
                aria-label="Maximum delivery time in minutes"
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-noir-500 border-b border-noir-100 pb-3">
        <span>{filteredRestaurants.length} Atelier(s) available for delivery</span>
        {hasActiveFilters && <span>Filtered Results</span>}
      </div>

      {/* Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4 bg-noir-50 rounded-3xl border border-noir-200 p-8">
          <p className="text-lg font-bold text-black">No fine dining ateliers match your filters.</p>
          <p className="text-xs text-noir-500 max-w-sm mx-auto">
            Try adjusting your search query, increasing delivery radius, or clearing applied filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-noir-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function RestaurantListingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono text-sm">Loading curated ateliers...</div>}>
      <RestaurantListingContent />
    </Suspense>
  );
}
