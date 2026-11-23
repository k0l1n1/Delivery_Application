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
  Tag,
  ShieldCheck,
  Percent,
  Check,
  X,
  Building2,
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
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-noir-100 border border-noir-200 flex items-center justify-center mx-auto text-noir-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-black">Your Food Bag is Empty</h1>
          <p className="text-xs text-noir-500 max-w-sm mx-auto">
            Order midnight cheese Maggi, kathi rolls, biryani pots, and iced coffee delivered straight to your room.
          </p>
        </div>
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black text-white hover:bg-noir-800 transition-colors text-xs font-semibold tracking-wide"
        >
          <span>Browse Canteens</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-noir-500">Hostel Order Bag</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-black mt-1">Review Your Meal</h1>
          {restaurantName && (
            <p className="text-xs text-noir-600 mt-1">
              Preparing from <strong className="text-black font-semibold">{restaurantName}</strong>
            </p>
          )}
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs text-noir-500 hover:text-red-600 font-mono transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Bag</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Item list */}
        <div className="lg:col-span-7 space-y-4">
          <div className="divide-y divide-noir-100 bg-white rounded-3xl border border-noir-200 shadow-subtle p-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-noir-100 flex-shrink-0">
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-black">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-noir-400 hover:text-red-600 p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.selected_customizations && item.selected_customizations.length > 0 && (
                    <div className="flex flex-wrap gap-1 py-1">
                      {item.selected_customizations.map((c, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-noir-100 text-noir-700 px-2 py-0.5 rounded font-mono"
                        >
                          {c.option_name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono font-bold text-sm text-black">
                      {formatCurrency(item.total_price)}
                    </span>

                    <div className="flex items-center gap-3 bg-noir-100 border border-noir-200 rounded-full px-2.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-noir-600 hover:text-black p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-noir-600 hover:text-black p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-noir-50 border border-noir-200 text-xs text-noir-600 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-black flex-shrink-0" />
            <span>
              Direct hostel room delivery. Free runner tip on orders above ₹150.
            </span>
          </div>
        </div>

        {/* Right: Bill Calculation & Coupons */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
              <Tag className="w-4 h-4" />
              <span>Student Coupons</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 bg-noir-50 border border-noir-300 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-xs text-black">{appliedCoupon.code}</span>
                    <p className="text-[11px] text-noir-500">{appliedCoupon.description}</p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-noir-400 hover:text-black p-1 transition-colors"
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
                    placeholder="e.g. EXAMNIGHT"
                    className="flex-1 px-4 py-2.5 rounded-full border border-noir-300 bg-noir-50 focus:bg-white focus:outline-none focus:border-black text-xs font-mono uppercase text-black"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-600 font-mono">{couponError}</p>}
                {couponSuccess && <p className="text-xs text-emerald-600 font-mono">{couponSuccess}</p>}
              </form>
            )}

            {!appliedCoupon && (
              <div className="pt-2 border-t border-noir-100 text-[11px] text-noir-500 font-mono">
                No current discounts available
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-black">Payment Summary</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-noir-600">
                <span>Food Items Total</span>
                <span className="font-mono text-black">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-noir-600">
                <span>Hostel Floor Runner Tip</span>
                <span className="font-mono text-black">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-noir-600">
                <span>Canteen GST (5%)</span>
                <span className="font-mono text-black">{formatCurrency(taxAmount)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    Coupon ({appliedCoupon?.code})
                  </span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-noir-200 flex items-center justify-between text-sm font-bold text-black">
                <span>Total to Pay</span>
                <span className="font-mono text-base">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 rounded-full bg-black text-white hover:bg-noir-800 transition-colors text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Room Address</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
