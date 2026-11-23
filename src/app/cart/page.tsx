'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Building2,
  Tag,
  Check,
  X,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    restaurantName,
    subtotal,
    deliveryFee,
    taxAmount,
    discountAmount,
    totalAmount,
    appliedCoupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-noir-100 dark:bg-noir-900 flex items-center justify-center text-noir-400 dark:text-noir-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-black dark:text-white">Your Food Bag is Empty</h2>
          <p className="text-xs text-noir-500 dark:text-noir-400 max-w-sm mx-auto">
            Browse our wholesome menu of organic millet bowls, ragi wraps, bajra burgers, and fresh cold brews.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-noir-800 dark:hover:bg-noir-200 transition-colors text-xs font-semibold tracking-wide"
        >
          <span>Browse Food Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-noir-500 dark:text-noir-400">Food Order Bag</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white mt-1">Review Your Meal</h1>
          {restaurantName && (
            <p className="text-xs text-noir-600 dark:text-noir-400 mt-1">
              Preparing from <strong className="text-black dark:text-white font-semibold">{restaurantName}</strong>
            </p>
          )}
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs text-noir-500 dark:text-noir-400 hover:text-red-600 font-mono transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Bag</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Item list */}
        <div className="lg:col-span-7 space-y-4">
          <div className="divide-y divide-noir-100 dark:divide-noir-800 bg-white dark:bg-noir-900 rounded-3xl border border-noir-200 dark:border-noir-800 shadow-subtle p-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-noir-100 dark:bg-noir-800 flex-shrink-0">
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-black dark:text-white">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-noir-400 hover:text-red-600 p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-mono text-noir-500 dark:text-noir-400">{formatCurrency(item.unit_price)} each</p>

                  {item.selected_customizations.length > 0 && (
                    <div className="text-[11px] text-noir-500 dark:text-noir-400 pt-1 space-y-0.5">
                      {item.selected_customizations.map((c) => (
                        <span
                          key={c.option_id}
                          className="inline-block bg-noir-100 dark:bg-noir-800 text-noir-700 dark:text-noir-300 px-2 py-0.5 rounded-full mr-1.5 text-[10px]"
                        >
                          +{c.option_name} ({formatCurrency(c.price_in_paise)})
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-noir-200 dark:border-noir-700 rounded-full px-2 py-1 bg-white dark:bg-noir-800">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-noir-100 dark:hover:bg-noir-700 rounded-full transition-colors text-black dark:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold w-5 text-center text-black dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-noir-100 dark:hover:bg-noir-700 rounded-full transition-colors text-black dark:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-sm text-black dark:text-white">
                      {formatCurrency(item.total_price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-noir-50 dark:bg-noir-900 border border-noir-200 dark:border-noir-800 text-xs text-noir-600 dark:text-noir-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
            <span>
              Direct campus doorstep delivery. Standard cafe delivery fee applies.
            </span>
          </div>
        </div>

        {/* Right: Bill Calculation & Coupons */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-noir-900 rounded-3xl border border-noir-200 dark:border-noir-800 p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              <Tag className="w-4 h-4" />
              <span>Coupons & Offers</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 bg-noir-50 dark:bg-noir-800 border border-noir-300 dark:border-noir-700 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-xs text-black dark:text-white">{appliedCoupon.code}</span>
                    <p className="text-[11px] text-noir-500 dark:text-noir-400">{appliedCoupon.description}</p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-noir-400 hover:text-black dark:hover:text-white p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 rounded-full border border-noir-300 dark:border-noir-700 bg-noir-50 dark:bg-noir-800 focus:bg-white dark:focus:bg-black focus:outline-none focus:border-black dark:focus:border-white text-xs font-mono uppercase text-black dark:text-white placeholder:text-noir-400 dark:placeholder:text-noir-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-noir-800 dark:hover:bg-noir-200 text-xs font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-600 font-mono">{couponError}</p>}
                {couponSuccess && <p className="text-xs text-emerald-600 font-mono">{couponSuccess}</p>}
              </form>
            )}

            {!appliedCoupon && (
              <div className="pt-2 border-t border-noir-100 dark:border-noir-800 text-[11px] text-noir-500 dark:text-noir-400 font-mono">
                No current discounts available
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-noir-900 rounded-3xl border border-noir-200 dark:border-noir-800 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-black dark:text-white">Payment Summary</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-noir-600 dark:text-noir-400">
                <span>Food Items Total</span>
                <span className="font-mono text-black dark:text-white">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-noir-600 dark:text-noir-400">
                <span>Delivery Courier Fee</span>
                <span className="font-mono text-black dark:text-white">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-noir-600 dark:text-noir-400">
                <span>GST (5%)</span>
                <span className="font-mono text-black dark:text-white">{formatCurrency(taxAmount)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-noir-200 dark:border-noir-800 flex items-center justify-between text-base font-bold text-black dark:text-white">
                <span>Grand Total</span>
                <span className="font-mono">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-noir-800 dark:hover:bg-noir-200 transition-colors text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
