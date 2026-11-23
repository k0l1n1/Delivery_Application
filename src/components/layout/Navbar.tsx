'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/store/cart-store';
import { useAuth } from '@/lib/store/auth-context';
import {
  ShoppingBag,
  MapPin,
  Search,
  User,
  ChevronDown,
  Menu,
  X,
  Compass,
  Clock,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('Mumbai, Bandra West');
  const [citySelectorOpen, setCitySelectorOpen] = useState(false);

  const cities = [
    'Mumbai, Bandra West',
    'Mumbai, BKC Financial Dist.',
    'Mumbai, Colaba Heritage',
    'Mumbai, Juhu Seaside',
    'Bengaluru, Indiranagar',
    'New Delhi, Golf Links',
  ];

  return (
    <header className="sticky top-[37px] z-40 bg-white/95 backdrop-blur-md border-b border-noir-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-mono text-2xl font-black tracking-widest text-black">NOIR</span>
              <span className="h-1.5 w-1.5 rounded-full bg-black group-hover:scale-150 transition-transform duration-200" />
            </Link>

            {/* Location Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCitySelectorOpen(!citySelectorOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-noir-700 bg-noir-100 hover:bg-noir-200 rounded-full border border-noir-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-black" />
                <span className="font-medium text-black">{currentCity}</span>
                <ChevronDown className="w-3 h-3 text-noir-500" />
              </button>

              {citySelectorOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-noir-200 rounded-xl shadow-premium p-2 z-50">
                  <p className="text-[11px] font-mono text-noir-400 uppercase tracking-wider px-2 py-1">
                    Select Delivery Zone
                  </p>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setCurrentCity(city);
                        setCitySelectorOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                        currentCity === city ? 'bg-black text-white font-medium' : 'text-noir-800 hover:bg-noir-100'
                      }`}
                    >
                      {city}
                      {currentCity === city && <span className="text-[10px] uppercase font-mono">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search bar & Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/restaurants"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                pathname === '/restaurants' ? 'text-black border-b-2 border-black pb-1' : 'text-noir-600 hover:text-black'
              }`}
            >
              <Compass className="w-4 h-4" />
              Restaurants
            </Link>

            <Link
              href="/restaurants?category=burgers"
              className="text-sm font-medium text-noir-600 hover:text-black transition-colors"
            >
              Burgers
            </Link>
            <Link
              href="/restaurants?category=pizza"
              className="text-sm font-medium text-noir-600 hover:text-black transition-colors"
            >
              Pizzas
            </Link>
            <Link
              href="/restaurants?category=biryani"
              className="text-sm font-medium text-noir-600 hover:text-black transition-colors"
            >
              Biryani
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-noir-500 bg-noir-100 hover:bg-noir-200 rounded-full border border-noir-200 w-56 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-noir-400" />
              <span>Search cuisine or dish...</span>
              <kbd className="ml-auto text-[10px] bg-white px-1.5 py-0.5 rounded border border-noir-300 font-mono text-noir-600">
                ⌘K
              </kbd>
            </Link>
          </div>

          {/* Right Action Icons: Cart, Profile */}
          <div className="flex items-center gap-4">
            {/* Cart Link */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full border border-noir-200 bg-white hover:bg-noir-50 transition-colors flex items-center justify-center text-black"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[11px] font-mono font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-noir-200 bg-noir-50 hover:bg-noir-100 transition-colors"
                >
                  <span className="text-xs font-medium text-black hidden sm:inline">{user.full_name.split(' ')[0]}</span>
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold font-mono">
                    {user.full_name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-noir-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-noir-200 rounded-2xl shadow-elevated p-2 z-50">
                    <div className="px-3 py-2 border-b border-noir-100">
                      <p className="text-xs font-semibold text-black">{user.full_name}</p>
                      <p className="text-[11px] text-noir-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 hover:bg-noir-100 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-noir-500" />
                        My Profile & Addresses
                      </Link>
                      <Link
                        href="/profile#orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 hover:bg-noir-100 rounded-lg transition-colors"
                      >
                        <Package className="w-4 h-4 text-noir-500" />
                        Order History
                      </Link>
                      <Link
                        href="/restaurant/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 hover:bg-noir-100 rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4 text-noir-500" />
                        Restaurant Portal
                      </Link>
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-noir-800 hover:bg-noir-100 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 text-noir-500" />
                        Platform Administration
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
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-xs font-semibold text-black hover:bg-noir-100 rounded-full transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-xs font-semibold bg-black text-white hover:bg-noir-800 rounded-full transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-noir-700 hover:text-black rounded-lg border border-noir-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-noir-200 bg-white px-4 py-4 space-y-3">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-noir-600 bg-noir-100 rounded-xl"
          >
            <Search className="w-4 h-4" />
            <span>Search culinary collections...</span>
          </Link>
          <div className="flex flex-col space-y-2 pt-2">
            <Link
              href="/restaurants"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-black hover:bg-noir-100 rounded-lg"
            >
              All Restaurants
            </Link>
            <Link
              href="/restaurants?category=burgers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-noir-700 hover:bg-noir-100 rounded-lg"
            >
              Artisanal Burgers
            </Link>
            <Link
              href="/restaurants?category=pizza"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-noir-700 hover:bg-noir-100 rounded-lg"
            >
              Wood-fired Pizzas
            </Link>
            <Link
              href="/restaurants?category=biryani"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-noir-700 hover:bg-noir-100 rounded-lg"
            >
              Royal Dum Biryani
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-noir-700 hover:bg-noir-100 rounded-lg"
            >
              My Account & Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
