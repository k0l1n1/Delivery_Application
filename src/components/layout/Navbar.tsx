'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart-store';
import { useAuth } from '@/lib/store/auth-context';
import { useTheme } from '@/lib/store/theme-context';
import { DELIVERY_LOCATIONS } from '@/lib/data/mock-data';
import {
  ShoppingBag,
  Building2,
  User,
  ChevronDown,
  Clock,
  LogOut,
  Settings,
  Package,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(DELIVERY_LOCATIONS[0]);
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-noir-200 dark:border-noir-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 1. Name & 2. Location that you choose */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-black dark:text-white transition-colors">
                MILLET CAFE
              </span>
            </Link>

            {/* Delivery Location Selector */}
            <div className="relative">
              <button
                onClick={() => setLocationSelectorOpen(!locationSelectorOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-noir-700 dark:text-noir-300 bg-noir-100 hover:bg-noir-200 dark:bg-noir-900 dark:hover:bg-noir-800 rounded-full border border-noir-200 dark:border-noir-800 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-black dark:text-white flex-shrink-0" />
                <span className="font-medium text-black dark:text-white truncate max-w-[140px] sm:max-w-[220px]">
                  {currentLocation}
                </span>
                <ChevronDown className="w-3 h-3 text-noir-500 flex-shrink-0" />
              </button>

              {locationSelectorOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-noir-900 border border-noir-200 dark:border-noir-800 rounded-2xl shadow-premium p-2 z-50">
                  <p className="text-[10px] font-mono text-noir-400 dark:text-noir-500 uppercase tracking-wider px-2 py-1">
                    Select Delivery Location
                  </p>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {DELIVERY_LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setCurrentLocation(loc);
                          setLocationSelectorOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between ${
                          currentLocation === loc
                            ? 'bg-black text-white dark:bg-white dark:text-black font-medium'
                            : 'text-noir-800 dark:text-noir-200 hover:bg-noir-100 dark:hover:bg-noir-800'
                        }`}
                      >
                        <span className="truncate">{loc}</span>
                        {currentLocation === loc && <span className="text-[9px] uppercase font-mono">Selected</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Cart Option, 4. Theme Toggle, & 5. Account Option */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Theme Toggle (Dark / Light Mode) */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-2.5 rounded-full border border-noir-200 dark:border-noir-800 bg-white dark:bg-noir-900 hover:bg-noir-50 dark:hover:bg-noir-800 transition-colors flex items-center justify-center text-black dark:text-white"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-noir-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Cart Option */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full border border-noir-200 dark:border-noir-800 bg-white dark:bg-noir-900 hover:bg-noir-50 dark:hover:bg-noir-800 transition-colors flex items-center justify-center text-black dark:text-white"
              aria-label="View Food Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-[11px] font-mono font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account Option */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-noir-200 dark:border-noir-800 bg-noir-50 dark:bg-noir-900 hover:bg-noir-100 dark:hover:bg-noir-800 transition-colors"
                >
                  <span className="text-xs font-medium text-black dark:text-white hidden sm:inline">
                    {user.full_name.split(' ')[0]}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-bold font-mono">
                    {user.full_name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-noir-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-noir-900 border border-noir-200 dark:border-noir-800 rounded-2xl shadow-elevated p-2 z-50">
                    <div className="px-3 py-2 border-b border-noir-100 dark:border-noir-800">
                      <p className="text-xs font-semibold text-black dark:text-white">{user.full_name}</p>
                      <p className="text-[11px] text-noir-500 dark:text-noir-400 truncate font-mono">
                        {user.roll_number || user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      {/* Dark/Light mode toggle in dropdown */}
                      <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-noir-800 dark:text-noir-200 hover:bg-noir-100 dark:hover:bg-noir-800 rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          {theme === 'light' ? (
                            <Moon className="w-4 h-4 text-noir-500" />
                          ) : (
                            <Sun className="w-4 h-4 text-amber-400" />
                          )}
                          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </span>
                        <span className="text-[10px] font-mono uppercase text-noir-400 dark:text-noir-500">
                          {theme === 'light' ? 'Off' : 'On'}
                        </span>
                      </button>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 dark:text-noir-200 hover:bg-noir-100 dark:hover:bg-noir-800 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-noir-500" />
                        Profile & Addresses
                      </Link>
                      <Link
                        href="/profile#orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 dark:text-noir-200 hover:bg-noir-100 dark:hover:bg-noir-800 rounded-lg transition-colors"
                      >
                        <Package className="w-4 h-4 text-noir-500" />
                        Order History
                      </Link>
                      <Link
                        href="/restaurant/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 dark:text-noir-200 hover:bg-noir-100 dark:hover:bg-noir-800 rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4 text-noir-500" />
                        Kitchen Dashboard
                      </Link>
                      <Link
                        href="/delivery/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 dark:text-noir-200 hover:bg-noir-100 dark:hover:bg-noir-800 rounded-lg transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-noir-500" />
                        Courier Dashboard
                      </Link>
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 dark:text-noir-200 hover:bg-noir-100 dark:hover:bg-noir-800 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 text-noir-500" />
                        Admin Dashboard
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-noir-100 dark:border-noir-800">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
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
                className="px-4 py-2 text-xs font-semibold text-black dark:text-white hover:bg-noir-100 dark:hover:bg-noir-900 border border-noir-300 dark:border-noir-700 rounded-full transition-colors"
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
