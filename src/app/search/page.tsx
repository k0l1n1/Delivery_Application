'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_RESTAURANTS } from '@/lib/data/mock-data';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import { Search, X, UtensilsCrossed, Compass } from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'dishes'>('all');

  // Search results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { matchingRestaurants: [], matchingDishes: [] };
    }

    const matchingRestaurants = MOCK_RESTAURANTS.filter((r) => {
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisines.some((c) => c.toLowerCase().includes(q));
      return matchName || matchCuisine;
    });

    const matchingDishes = MOCK_RESTAURANTS.flatMap((r) =>
      (r.items || [])
        .filter((item) => {
          const matchItemName = item.name.toLowerCase().includes(q);
          const matchItemDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category_name?.toLowerCase().includes(q);
          return matchItemName || matchItemDesc || matchCat;
        })
        .map((item) => ({
          item,
          restaurant: { id: r.id, name: r.name, delivery_fee: r.delivery_fee },
        }))
    );

    return { matchingRestaurants, matchingDishes };
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
          Search Fine Dining
        </h1>
        <p className="text-xs text-noir-500 font-mono">
          Find your preferred restaurant, artisanal preparation, or gourmet ingredient
        </p>

        {/* Input */}
        <div className="relative flex items-center pt-2">
          <Search className="absolute left-4 w-5 h-5 text-noir-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Wagyu, Truffle Pizza, Dum Biryani, Cod..."
            autoFocus
            className="w-full pl-12 pr-10 py-4 rounded-full border border-noir-300 bg-noir-50 focus:bg-white focus:outline-none focus:border-black text-sm text-black transition-all shadow-subtle"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 text-noir-400 hover:text-black p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-noir-400 font-mono">Trending:</span>
          {['Truffle', 'Black Cod', 'Biryani', 'Smash Burger', 'Wagyu', 'Croissant'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full bg-noir-100 hover:bg-noir-200 text-noir-800 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      {query.trim() && (
        <div className="flex items-center justify-center gap-2 border-b border-noir-200 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'all' ? 'bg-black text-white' : 'text-noir-600 hover:bg-noir-100'
            }`}
          >
            All Results ({results.matchingRestaurants.length + results.matchingDishes.length})
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'restaurants' ? 'bg-black text-white' : 'text-noir-600 hover:bg-noir-100'
            }`}
          >
            Restaurants ({results.matchingRestaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'dishes' ? 'bg-black text-white' : 'text-noir-600 hover:bg-noir-100'
            }`}
          >
            Dishes ({results.matchingDishes.length})
          </button>
        </div>
      )}

      {/* Results Content */}
      {query.trim() ? (
        <div className="space-y-12">
          {/* Restaurants Section */}
          {(activeTab === 'all' || activeTab === 'restaurants') &&
            results.matchingRestaurants.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-black" />
                  <h2 className="text-lg font-bold text-black">Matching Restaurants</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.matchingRestaurants.map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              </div>
            )}

          {/* Dishes Section */}
          {(activeTab === 'all' || activeTab === 'dishes') &&
            results.matchingDishes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-black" />
                  <h2 className="text-lg font-bold text-black">Matching Gourmet Dishes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.matchingDishes.map(({ item, restaurant }) => (
                    <FoodItemCard key={item.id} item={item} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            )}

          {results.matchingRestaurants.length === 0 && results.matchingDishes.length === 0 && (
            <div className="py-20 text-center bg-noir-50 rounded-3xl border border-noir-200 space-y-2">
              <p className="font-bold text-black">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-noir-500">
                Check for typos or try searching for a general cuisine like &ldquo;Japanese&rdquo; or &ldquo;Pizza&rdquo;.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-noir-400 font-mono">
          Enter a search query above to browse curated culinary items.
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono text-sm">Searching NOIR catalog...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
