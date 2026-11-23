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
              <span className="text-[10px] font-mono tracking-widest uppercase bg-white text-black px-2 py-0.5 rounded font-bold">
                CAMPUS
              </span>
            </div>
            <p className="text-noir-400 text-sm max-w-sm leading-relaxed">
              Direct-to-hostel food delivery system engineered for campus students. Delivering hot meals, late-night
              study snacks, and cold brews right to your hostel room door.
            </p>
            <div className="pt-2 text-xs text-noir-500 font-mono">
              Operating 24/7 • Serving All Boys & Girls Hostels, PG Block & Library.
            </div>
          </div>

          {/* Column 1: Canteen Menu */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-400">Campus Food</p>
            <ul className="space-y-2 text-sm text-noir-300">
              <li>
                <Link href="/restaurants" className="hover:text-white transition-colors">
                  All Campus Canteens
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=midnight-snacks" className="hover:text-white transition-colors">
                  Midnight Maggi & Fries
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=rolls" className="hover:text-white transition-colors">
                  Kathi Rolls & Wraps
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=biryani" className="hover:text-white transition-colors">
                  Hostel Dum Biryani
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=thalis" className="hover:text-white transition-colors">
                  Mess Upgrade Thalis
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Portals */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-400">Hostel Portals</p>
            <ul className="space-y-2 text-sm text-noir-300">
              <li>
                <Link href="/restaurant/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  Canteen Kitchen <ArrowUpRight className="w-3 h-3 text-noir-500" />
                </Link>
              </li>
              <li>
                <Link href="/delivery/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  Hostel Floor Runner <ArrowUpRight className="w-3 h-3 text-noir-500" />
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  Warden Administration <ArrowUpRight className="w-3 h-3 text-noir-500" />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Student Room & Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hostel Zones */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-400">Hostel Zones</p>
            <ul className="space-y-2 text-sm text-noir-300">
              <li>
                <span className="text-noir-500">Boys Hostels (BH 1, 2, 3)</span>
              </li>
              <li>
                <span className="text-noir-500">Girls Hostels (GH 1, 2, 3)</span>
              </li>
              <li>
                <span className="text-noir-500">PG & Research Wing</span>
              </li>
              <li>
                <span className="text-noir-500">24/7 Library Reading Hall</span>
              </li>
              <li>
                <span className="text-noir-500">UPI & Cash on Room Delivery</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-noir-900 flex flex-col sm:flex-row items-center justify-between text-xs text-noir-500">
          <p>© {new Date().getFullYear()} NOIR Campus Food Delivery. Designed for Students.</p>
          <p className="font-mono mt-2 sm:mt-0">Black & White Edition • Direct-to-Hostel-Room Network</p>
        </div>
      </div>
    </footer>
  );
}
