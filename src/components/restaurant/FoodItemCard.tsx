'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FoodItem, CartItemOption } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/store/cart-store';
import ItemCustomizationModal from '@/components/ui/ItemCustomizationModal';
import { Plus, Check } from 'lucide-react';

interface FoodItemCardProps {
  item: FoodItem;
  restaurant: { id: string; name: string; delivery_fee: number };
}

export default function FoodItemCard({ item, restaurant }: FoodItemCardProps) {
  const { addItem, items } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Check if item is already in cart
  const inCartCount = items
    .filter((i) => i.food_item_id === item.id)
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAddClick = () => {
    if (item.customizations && item.customizations.length > 0) {
      setModalOpen(true);
    } else {
      addItem(item, restaurant, [], 1);
      triggerAddedAnimation();
    }
  };

  const triggerAddedAnimation = () => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleModalAdd = (customizations: CartItemOption[], quantity: number) => {
    addItem(item, restaurant, customizations, quantity);
    triggerAddedAnimation();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-noir-200 p-4 flex gap-4 hover:border-black transition-smooth shadow-subtle hover:shadow-premium group">
        {/* Left Information */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {/* Veg / Non-Veg Indicator */}
              <span
                className={`w-3.5 h-3.5 border ${
                  item.is_veg ? 'border-emerald-500' : 'border-rose-500'
                } flex items-center justify-center p-0.5 rounded-sm`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </span>

              {item.is_popular && (
                <span className="text-[10px] font-mono uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">
                  Signature
                </span>
              )}
            </div>

            <h4 className="font-bold text-sm text-black group-hover:text-noir-800 transition-colors">
              {item.name}
            </h4>

            <p className="text-xs text-noir-500 line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <span className="font-mono font-bold text-sm text-black">
              {formatCurrency(item.price)}
            </span>
            {item.compare_at_price && (
              <span className="font-mono text-xs text-noir-400 line-through">
                {formatCurrency(item.compare_at_price)}
              </span>
            )}
          </div>
        </div>

        {/* Right Photo & Add Button */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-noir-100 flex-shrink-0">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-smooth"
            sizes="128px"
          />

          <div className="absolute bottom-2 right-2">
            <button
              onClick={handleAddClick}
              disabled={!item.is_available}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md transition-all ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : item.is_available
                  ? 'bg-black text-white hover:bg-noir-800 hover:scale-105'
                  : 'bg-noir-300 text-noir-600 cursor-not-allowed'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Added</span>
                </>
              ) : inCartCount > 0 ? (
                <>
                  <Plus className="w-3 h-3" />
                  <span>{inCartCount} in bag</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ItemCustomizationModal
        item={item}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToCart={handleModalAdd}
      />
    </>
  );
}
