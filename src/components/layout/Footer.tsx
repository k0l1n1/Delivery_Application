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
              <span className="font-mono text-3xl font-black tracking-widest text-white">MILLET CAFE</span>
            </div>
            <p className="text-noir-400 text-sm max-w-sm leading-relaxed">
              Organic millet bowls, artisanal stone-ground wraps, fresh juices, and warm comforting meals delivered
              straight to your campus desk, building, and study hub.
            </p>
            <div className="pt-2 text-xs text-noir-500 font-mono">
              Operating 7:00 AM – 11:00 PM • Serving all campus academic and library blocks.
            </div>
          </div>

          {/* Column 1: Menu */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-400">Food Menu</p>
            <ul className="space-y-2 text-sm text-noir-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Full Menu
                </Link>
              </li>
              <li>
                <Link href="/?category=millet-bowls" className="hover:text-white transition-colors">
                  Millet Bowls
                </Link>
              </li>
              <li>
                <Link href="/?category=wraps-rolls" className="hover:text-white transition-colors">
                  Ragi Wraps
                </Link>
              </li>
              <li>
                <Link href="/?category=biryani" className="hover:text-white transition-colors">
                  Millet Dum Biryani
                </Link>
              </li>
              <li>
                <Link href="/?category=brews-teas" className="hover:text-white transition-colors">
                  Brews & Juices
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Portals */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-400">Dashboards</p>
            <ul className="space-y-2 text-sm text-noir-300">
              <li>
                <Link href="/restaurant/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  Kitchen Dashboard <ArrowUpRight className="w-3 h-3 text-noir-500" />
                </Link>
              </li>
              <li>
                <Link href="/delivery/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  Courier Dashboard <ArrowUpRight className="w-3 h-3 text-noir-500" />
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  Admin Dashboard <ArrowUpRight className="w-3 h-3 text-noir-500" />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Account & Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-noir-400">Delivery Zones</p>
            <ul className="space-y-2 text-sm text-noir-300">
              <li>
                <span className="text-noir-500">Central Campus Hub</span>
              </li>
              <li>
                <span className="text-noir-500">Academic Blocks A & B</span>
              </li>
              <li>
                <span className="text-noir-500">Central Library Reading Hall</span>
              </li>
              <li>
                <span className="text-noir-500">Tech & Innovation Center</span>
              </li>
              <li>
                <span className="text-noir-500">UPI & Cash on Delivery</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-noir-900 flex flex-col sm:flex-row items-center justify-between text-xs text-noir-500">
          <p>© {new Date().getFullYear()} MILLET CAFE. All rights reserved.</p>
          <p className="font-mono mt-2 sm:mt-0">Premium Monochrome Food Platform</p>
        </div>
      </div>
    </footer>
  );
}
