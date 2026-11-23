import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-noir-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-3xl font-black tracking-widest text-white">NOIR</span>
              <span className="h-2 w-2 rounded-full bg-white" />
            </div>
            <p className="text-noir-400 text-sm max-w-sm leading-relaxed">
              Curated fine dining delivered with architectural precision. Savor recipes from the nation’s celebrated
              culinary ateliers in bespoke thermal packaging.
            </p>
            <div className="pt-2 text-xs text-noir-500 font-mono">
              Designed & Engineered for connoisseurs of taste.
            </div>
          </div>

          {/* Column 1: Discover */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-400">Discover</p>
            <ul className="space-y-2 text-sm text-noir-300">
              <li>
                <Link href="/restaurants" className="hover:text-white transition-colors">
                  All Restaurants
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=burgers" className="hover:text-white transition-colors">
                  Artisanal Burgers
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=pizza" className="hover:text-white transition-colors">
                  Sourdough Pizzas
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=biryani" className="hover:text-white transition-colors">
                  Royal Dum Biryani
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=desserts" className="hover:text-white transition-colors">
                  Pâtisserie & Desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Partner & Dashboards */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-400">Portals</p>
            <ul className="space-y-2 text-sm text-noir-300">
              <li>
                <Link href="/restaurant/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  Restaurant Owner <ArrowUpRight className="w-3 h-3 text-noir-500" />
                </Link>
              </li>
              <li>
                <Link href="/delivery/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  Delivery Partner <ArrowUpRight className="w-3 h-3 text-noir-500" />
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  Admin Governance <ArrowUpRight className="w-3 h-3 text-noir-500" />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Customer Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Gourmet Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Standards */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-400">Standards</p>
            <ul className="space-y-2 text-sm text-noir-300">
              <li>
                <span className="text-noir-500 cursor-default">FSSAI Certified</span>
              </li>
              <li>
                <span className="text-noir-500 cursor-default">100% Eco-Thermal Packaging</span>
              </li>
              <li>
                <span className="text-noir-500 cursor-default">Secure Razorpay Encryption</span>
              </li>
              <li>
                <span className="text-noir-500 cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-noir-500 cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-noir-900 flex flex-col sm:flex-row items-center justify-between text-xs text-noir-500">
          <p>© {new Date().getFullYear()} NOIR Technologies Inc. All rights reserved.</p>
          <p className="font-mono mt-2 sm:mt-0">Black & White Edition • Mumbai • Bengaluru • Delhi</p>
        </div>
      </div>
    </footer>
  );
}
