import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-noir-50 dark:bg-black text-black dark:text-white border-t border-noir-200 dark:border-noir-900 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-3xl font-black tracking-widest text-black dark:text-white">MILLET CAFE</span>
            </div>
            <p className="text-noir-600 dark:text-noir-400 text-sm max-w-sm leading-relaxed">
              Organic millet bowls, curated wholesome combos, stone-ground rolls, and cold-pressed drinks delivered straight to your campus desk, building, and study hub.
            </p>
            <div className="pt-2 text-xs text-noir-500 dark:text-noir-400 font-mono space-y-1">
              <p>Operating 7:00 AM – 11:00 PM • Fast campus-wide delivery.</p>
              <p className="text-[11px] text-noir-400 dark:text-noir-500">100% Natural • Zero Preservatives • Wholesome Grains</p>
            </div>
          </div>

          {/* Column 1: Food Menu (Updated to the 6 exact active categories) */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-500 dark:text-noir-400 font-semibold">Food Menu</p>
            <ul className="space-y-2 text-sm text-noir-600 dark:text-noir-300 font-medium">
              <li>
                <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
                  All Items
                </Link>
              </li>
              <li>
                <Link href="/?category=combo" className="hover:text-black dark:hover:text-white transition-colors">
                  Combo Meals
                </Link>
              </li>
              <li>
                <Link href="/?category=non-veg" className="hover:text-black dark:hover:text-white transition-colors">
                  Non Veg
                </Link>
              </li>
              <li>
                <Link href="/?category=veg" className="hover:text-black dark:hover:text-white transition-colors">
                  Veg
                </Link>
              </li>
              <li>
                <Link href="/?category=drinks" className="hover:text-black dark:hover:text-white transition-colors">
                  Drinks
                </Link>
              </li>
              <li>
                <Link href="/?category=snacks" className="hover:text-black dark:hover:text-white transition-colors">
                  Snacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Access (Updated from internal dashboards to customer links) */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-500 dark:text-noir-400 font-semibold">Customer Access</p>
            <ul className="space-y-2 text-sm text-noir-600 dark:text-noir-300 font-medium">
              <li>
                <Link href="/profile" className="hover:text-black dark:hover:text-white transition-colors">
                  My Account & Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-black dark:hover:text-white transition-colors">
                  Food Bag
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-black dark:hover:text-white transition-colors">
                  Checkout & Payment
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/restaurant/dashboard" className="text-xs text-noir-500 dark:text-noir-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                  Staff & Kitchen Portal <ArrowUpRight className="w-3 h-3 text-noir-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Delivery Zones & Campus Info */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-500 dark:text-noir-400 font-semibold">Delivery Zones</p>
            <ul className="space-y-2 text-sm text-noir-600 dark:text-noir-400">
              <li>Central Campus Hub</li>
              <li>Academic Blocks A & B</li>
              <li>Central Library Reading Hall</li>
              <li>Tech & Innovation Center</li>
              <li>Student Activity Complex</li>
            </ul>
            <div className="pt-2 text-xs font-mono text-noir-500 dark:text-noir-400">
              Accepted: UPI, Cards & Cash on Delivery
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-noir-200 dark:border-noir-900 flex flex-col sm:flex-row items-center justify-between text-xs text-noir-500 dark:text-noir-400">
          <p>© {new Date().getFullYear()} MILLET CAFE. All rights reserved.</p>
          <p className="font-mono mt-2 sm:mt-0">Premium Monochrome Food Platform</p>
        </div>
      </div>
    </footer>
  );
}
