'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth-context';
import { UserRole } from '@/types/database';
import { Lock, Mail, ArrowRight } from 'lucide-react';

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

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="font-mono text-3xl font-black tracking-widest text-black">NOIR</span>
        <h1 className="text-2xl font-bold tracking-tight text-black">Student Portal Sign In</h1>
        <p className="text-xs text-noir-500 font-mono">
          Enter your student credentials to access room food delivery
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-3xl border border-noir-200 shadow-subtle">
        <div>
          <label className="text-xs font-mono uppercase text-noir-500">College / Student Email</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campus.edu"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-noir-300 text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-noir-500">Password</label>
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
          <label className="text-xs font-mono uppercase text-noir-500">Account Type</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs focus:outline-none focus:border-black bg-white"
          >
            <option value="customer">Hostel Student</option>
            <option value="restaurant_owner">Canteen Kitchen Staff</option>
            <option value="delivery_partner">Hostel Runner</option>
            <option value="admin">Hostel Warden / Dining Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="text-center text-xs text-noir-500 pt-2">
          New student?{' '}
          <Link href="/auth/signup" className="text-black font-semibold underline">
            Register Account
          </Link>
        </p>
      </form>
    </div>
  );
}
