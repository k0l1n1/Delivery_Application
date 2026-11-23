'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth-context';
import { UserRole } from '@/types/database';
import { Lock, Mail, ArrowRight, ShieldCheck, User, Store, Bike } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await login(email, role);
    setLoading(false);

    if (role === 'restaurant_owner') router.push('/restaurant/dashboard');
    else if (role === 'delivery_partner') router.push('/delivery/dashboard');
    else if (role === 'admin') router.push('/admin/dashboard');
    else router.push('/');
  };

  const handleQuickDemo = async (targetRole: UserRole) => {
    setLoading(true);
    const demoEmails: Record<UserRole, string> = {
      customer: 'alexander@noir.luxury',
      restaurant_owner: 'chef.antoine@latelier.com',
      delivery_partner: 'rohan.delivery@noir.luxury',
      admin: 'governance@noir.luxury',
    };
    await login(demoEmails[targetRole], targetRole);
    setLoading(false);

    if (targetRole === 'restaurant_owner') router.push('/restaurant/dashboard');
    else if (targetRole === 'delivery_partner') router.push('/delivery/dashboard');
    else if (targetRole === 'admin') router.push('/admin/dashboard');
    else router.push('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="font-mono text-3xl font-black tracking-widest text-black">NOIR</span>
        <h1 className="text-2xl font-bold tracking-tight text-black">Connoisseur Portal</h1>
        <p className="text-xs text-noir-500 font-mono">
          Enter credentials or test with one-click instant demo personas
        </p>
      </div>

      {/* One Click Instant Demo Logins */}
      <div className="p-4 rounded-2xl bg-noir-50 border border-noir-200 space-y-3">
        <p className="text-[11px] font-mono uppercase tracking-wider text-noir-500">
          Instant Demo Switch:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-noir-300 hover:border-black font-semibold text-black transition-colors"
          >
            <User className="w-3.5 h-3.5" /> Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('restaurant_owner')}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-noir-300 hover:border-black font-semibold text-black transition-colors"
          >
            <Store className="w-3.5 h-3.5" /> Chef Owner
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('delivery_partner')}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-noir-300 hover:border-black font-semibold text-black transition-colors"
          >
            <Bike className="w-3.5 h-3.5" /> Courier
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-noir-300 hover:border-black font-semibold text-black transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-3xl border border-noir-200 shadow-subtle">
        <div>
          <label className="text-xs font-mono uppercase text-noir-500">Email Address</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexander@noir.luxury"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-noir-300 text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-noir-500">Security Passcode</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-noir-300 text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-noir-500">Login Persona</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs focus:outline-none focus:border-black bg-white"
          >
            <option value="customer">Customer</option>
            <option value="restaurant_owner">Restaurant Owner</option>
            <option value="delivery_partner">Delivery Partner</option>
            <option value="admin">Platform Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="text-center text-xs text-noir-500 pt-2">
          New to NOIR?{' '}
          <Link href="/auth/signup" className="text-black font-semibold underline">
            Create an Account
          </Link>
        </p>
      </form>
    </div>
  );
}
