'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/store/auth-context';
import { UserRole } from '@/types/database';
import { ShieldCheck, Store, Bike, GraduationCap, ArrowRight } from 'lucide-react';

export default function RoleSwitcherBar() {
  const { role, switchRole, user } = useAuth();

  const roles: { id: UserRole; label: string; icon: React.ReactNode; href: string }[] = [
    { id: 'customer', label: 'Hostel Student', icon: <GraduationCap className="w-3.5 h-3.5" />, href: '/' },
    { id: 'restaurant_owner', label: 'Canteen Kitchen', icon: <Store className="w-3.5 h-3.5" />, href: '/restaurant/dashboard' },
    { id: 'delivery_partner', label: 'Hostel Runner', icon: <Bike className="w-3.5 h-3.5" />, href: '/delivery/dashboard' },
    { id: 'admin', label: 'Warden Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, href: '/admin/dashboard' },
  ];

  return (
    <div className="bg-black text-white text-xs border-b border-noir-800 py-1.5 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-noir-400 font-mono tracking-wider uppercase text-[10px]">Active Persona:</span>
          <div className="flex items-center gap-1 bg-noir-900 border border-noir-700 rounded-full p-0.5">
            {roles.map((r) => {
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors ${
                    isActive
                      ? 'bg-white text-black font-medium shadow-sm'
                      : 'text-noir-300 hover:text-white hover:bg-noir-800'
                  }`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-noir-400 hidden sm:inline">
            Active: <strong className="text-white font-normal">{user?.full_name}</strong>
          </span>
          {role !== 'customer' && (
            <Link
              href={roles.find((r) => r.id === role)?.href || '/'}
              className="flex items-center gap-1 bg-noir-800 hover:bg-noir-700 text-white px-2 py-0.5 rounded text-[11px] border border-noir-700 font-mono"
            >
              Open {roles.find((r) => r.id === role)?.label} Portal
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
