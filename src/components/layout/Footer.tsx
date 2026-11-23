import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Clock,
  MapPin,
  ShoppingBag,
  User,
  CreditCard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-white dark:bg-[#0A0A0A] text-black dark:text-white border-t border-noir-200/80 dark:border-noir-800/80 mt-24 transition-colors">
      {/* Subtle top ambient highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-noir-400/30 dark:via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand Info & Mission (Col 1-5) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-3xl font-black tracking-widest text-black dark:text-white">
                  MILLET CAFE
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  KITCHEN OPEN
                </span>
              </div>
              <p className="text-noir-600 dark:text-noir-400 text-sm leading-relaxed max-w-md">
                Organic millet bowls, curated wholesome combos, stone-ground rolls, and cold-pressed drinks delivered straight to your campus desk, building, and study hub.
              </p>
            </div>

            {/* Operating Hours Card */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-noir-50 dark:bg-[#121212] border border-noir-200/80 dark:border-noir-800 text-xs font-mono text-noir-700 dark:text-noir-300 max-w-md">
              <Clock className="w-4 h-4 text-noir-500 dark:text-noir-400 shrink-0" />
              <div>
                <span className="font-semibold text-black dark:text-white">Operating Hours: </span>
                <span>7:00 AM – 11:00 PM</span>
                <span className="block text-[11px] text-noir-500 dark:text-noir-400 mt-0.5">Fast campus-wide dispatch across academic & library blocks</span>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-noir-600 dark:text-noir-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-noir-100/70 dark:bg-noir-900 border border-noir-200/60 dark:border-noir-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 100% Pure Millets
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-noir-100/70 dark:bg-noir-900 border border-noir-200/60 dark:border-noir-800">
                <ShieldCheck className="w-3 h-3 text-noir-500 dark:text-noir-400" /> Zero Preservatives
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-noir-100/70 dark:bg-noir-900 border border-noir-200/60 dark:border-noir-800">
                <Sparkles className="w-3 h-3 text-noir-500 dark:text-noir-400" /> Wholesome Grains
              </span>
            </div>
          </div>

          {/* Column 1: Food Menu (Col 6-7) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-noir-400 dark:text-noir-500 font-bold">
              Food Menu
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="group flex items-center justify-between text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">All Items</span>
                  <span className="text-[10px] font-mono text-noir-400 dark:text-noir-600 group-hover:text-noir-500">All</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=combo"
                  className="group flex items-center justify-between text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Combo Meals</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black font-semibold">
                    Hot
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=non-veg"
                  className="group flex items-center justify-between text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                    Non Veg
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=veg"
                  className="group flex items-center justify-between text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Veg
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=drinks"
                  className="group flex items-center justify-between text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Drinks</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=snacks"
                  className="group flex items-center justify-between text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Snacks</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Access (Col 8-9) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-noir-400 dark:text-noir-500 font-bold">
              Customer Access
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/profile"
                  className="group flex items-center gap-2 text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-noir-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">My Account & Orders</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="group flex items-center gap-2 text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-noir-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Food Bag</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="group flex items-center gap-2 text-noir-600 dark:text-noir-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-noir-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Checkout & Payment</span>
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/restaurant/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-noir-100 hover:bg-noir-200 dark:bg-noir-900 dark:hover:bg-noir-800 text-xs font-mono text-noir-700 dark:text-noir-300 hover:text-black dark:hover:text-white transition-all border border-noir-200/60 dark:border-noir-800"
                >
                  <span>Staff & Kitchen Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-noir-400 group-hover:text-black dark:group-hover:text-white" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Delivery Zones & Campus (Col 10-12) */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-noir-400 dark:text-noir-500 font-bold">
              Delivery Zones
            </p>
            <ul className="space-y-2 text-xs font-mono text-noir-600 dark:text-noir-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-noir-400 dark:text-noir-500 shrink-0" />
                <span>Central Campus Hub</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-noir-400 dark:text-noir-500 shrink-0" />
                <span>Academic Blocks A & B</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-noir-400 dark:text-noir-500 shrink-0" />
                <span>Central Library Reading Hall</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-noir-400 dark:text-noir-500 shrink-0" />
                <span>Tech & Innovation Center</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-noir-400 dark:text-noir-500 shrink-0" />
                <span>Student Activity Complex</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-noir-200/60 dark:border-noir-800/60 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-noir-400 dark:text-noir-500 block">
                Instant Payment Options
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-noir-600 dark:text-noir-400">
                <span className="px-2 py-0.5 rounded bg-noir-100 dark:bg-noir-900 border border-noir-200/60 dark:border-noir-800">
                  UPI
                </span>
                <span className="px-2 py-0.5 rounded bg-noir-100 dark:bg-noir-900 border border-noir-200/60 dark:border-noir-800">
                  Cards
                </span>
                <span className="px-2 py-0.5 rounded bg-noir-100 dark:bg-noir-900 border border-noir-200/60 dark:border-noir-800">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & System Status */}
        <div className="mt-14 pt-6 border-t border-noir-200/80 dark:border-noir-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-noir-500 dark:text-noir-400">
          <p>© {new Date().getFullYear()} MILLET CAFE. All rights reserved.</p>
          
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>All Campus Kitchen Stations Active</span>
          </div>

          <p className="font-mono text-[11px] text-noir-400 dark:text-noir-500">
            Premium Monochrome Food Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
