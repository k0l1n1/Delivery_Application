'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Restaurant } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Star, Clock, Bike, ShieldCheck } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group block bg-white rounded-2xl border border-noir-200 overflow-hidden hover:border-black transition-smooth shadow-subtle hover:shadow-premium"
    >
      {/* Cover Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-noir-100">
        <Image
          src={restaurant.cover_image}
          alt={restaurant.name}
          fill
          className="object-cover group-hover:scale-105 transition-smooth duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Price Range & Rating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-black/80 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/20">
            {restaurant.price_range}
          </span>
          {restaurant.is_verified && (
            <span className="bg-white/90 backdrop-blur-md text-black text-[11px] font-mono px-2 py-1 rounded-full flex items-center gap-1 border border-noir-200">
              <ShieldCheck className="w-3 h-3 text-black" />
              Verified
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <Clock className="w-3 h-3" />
            <span>
              {restaurant.delivery_time_min}-{restaurant.delivery_time_max} mins
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white text-black px-2.5 py-1 rounded-full font-mono font-bold shadow-sm">
            <Star className="w-3 h-3 fill-black text-black" />
            <span>{restaurant.rating.toFixed(1)}</span>
            <span className="text-[10px] text-noir-500 font-normal">({restaurant.rating_count})</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base text-black group-hover:text-noir-800 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
        </div>

        <p className="text-xs text-noir-500 line-clamp-1">{restaurant.cuisines.join(' • ')}</p>

        <div className="pt-2 border-t border-noir-100 flex items-center justify-between text-xs text-noir-600 font-mono">
          <div className="flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-noir-400" />
            <span>{restaurant.delivery_fee === 0 ? 'Free Delivery' : formatCurrency(restaurant.delivery_fee)}</span>
          </div>
          <span className="text-noir-400">Min. {formatCurrency(restaurant.minimum_order)}</span>
        </div>
      </div>
    </Link>
  );
}
