'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth-context';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get('redirect');
      if (redir && redir.startsWith('/')) {
        setRedirectPath(redir);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    await signup(email, name, 'customer');
    setLoading(false);

    router.push(redirectPath);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="font-mono text-3xl font-black tracking-widest text-black">MILLET CAFE</span>
        <h1 className="text-2xl font-bold tracking-tight text-black">Create Account</h1>
        <p className="text-xs text-noir-500 font-mono">
          Order wholesome meals delivered across campus
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-3xl border border-noir-200 shadow-subtle">
        <div>
          <label className="text-xs font-mono uppercase text-noir-500">Full Name</label>
          <div className="relative mt-1">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-noir-300 text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-noir-500">Email Address</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@campus.edu"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Creating Membership...' : 'Create Account'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="text-center text-xs text-noir-500 pt-2">
          Already have an account?{' '}
          <Link
            href={redirectPath !== '/' ? `/auth/login?redirect=${encodeURIComponent(redirectPath)}` : '/auth/login'}
            className="text-black font-semibold underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
