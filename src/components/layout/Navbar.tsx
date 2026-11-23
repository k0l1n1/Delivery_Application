'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart-store';
import { useAuth } from '@/lib/store/auth-context';
import { HOSTEL_LIST } from '@/lib/data/mock-data';
import {
  ShoppingBag,
  Building2,
  User,
  ChevronDown,
  Clock,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentHostel, setCurrentHostel] = useState(HOSTEL_LIST[1]); // Boys Hostel 2 (Aravali)
  const [hostelSelectorOpen, setHostelSelectorOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-noir-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 1. Name & 2. Location that you choose */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <span className="font-mono text-2xl font-black tracking-widest text-black">NOIR</span>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-black text-white px-1.5 py-0.5 rounded">
                HOSTEL
              </span>
            </Link>

            {/* Hostel Location Selector */}
            <div className="relative">
              <button
                onClick={() => setHostelSelectorOpen(!hostelSelectorOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-noir-700 bg-noir-100 hover:bg-noir-200 rounded-full border border-noir-200 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-black flex-shrink-0" />
                <span className="font-medium text-black truncate max-w-[140px] sm:max-w-[220px]">
                  {currentHostel}
                </span>
                <ChevronDown className="w-3 h-3 text-noir-500 flex-shrink-0" />
              </button>

              {hostelSelectorOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white border border-noir-200 rounded-2xl shadow-premium p-2 z-50">
                  <p className="text-[10px] font-mono text-noir-400 uppercase tracking-wider px-2 py-1">
                    Select Your Delivery Hostel
                  </p>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {HOSTEL_LIST.map((h) => (
                      <button
                        key={h}
                        onClick={() => {
                          setCurrentHostel(h);
                          setHostelSelectorOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between ${
                          currentHostel === h ? 'bg-black text-white font-medium' : 'text-noir-800 hover:bg-noir-100'
                        }`}
                      >
                        <span className="truncate">{h}</span>
                        {currentHostel === h && <span className="text-[9px] uppercase font-mono">Selected</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Cart Option & 4. Account Option ONLY */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Option */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full border border-noir-200 bg-white hover:bg-noir-50 transition-colors flex items-center justify-center text-black"
              aria-label="View Food Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[11px] font-mono font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account Option */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-noir-200 bg-noir-50 hover:bg-noir-100 transition-colors"
                >
                  <span className="text-xs font-medium text-black hidden sm:inline">
                    {user.full_name.split(' ')[0]}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold font-mono">
                    {user.full_name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-noir-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-noir-200 rounded-2xl shadow-elevated p-2 z-50">
                    <div className="px-3 py-2 border-b border-noir-100">
                      <p className="text-xs font-semibold text-black">{user.full_name}</p>
                      <p className="text-[11px] text-noir-500 truncate font-mono">
                        {user.roll_number || user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 hover:bg-noir-100 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-noir-500" />
                        Hostel Room & Profile
                      </Link>
                      <Link
                        href="/profile#orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 hover:bg-noir-100 rounded-lg transition-colors"
                      >
                        <Package className="w-4 h-4 text-noir-500" />
                        Hostel Order History
                      </Link>
                      <Link
                        href="/restaurant/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 hover:bg-noir-100 rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4 text-noir-500" />
                        Canteen Kitchen Dashboard
                      </Link>
                      <Link
                        href="/delivery/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 hover:bg-noir-100 rounded-lg transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-noir-500" />
                        Hostel Runner Dashboard
                      </Link>
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 hover:bg-noir-100 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 text-noir-500" />
                        Campus Dining Admin
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-noir-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 text-xs font-semibold text-black hover:bg-noir-100 border border-noir-300 rounded-full transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
