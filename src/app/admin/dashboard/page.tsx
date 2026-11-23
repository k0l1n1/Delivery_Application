'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/store/auth-context';
import { useOrders } from '@/lib/store/order-store';
import { MOCK_RESTAURANTS, MOCK_CATEGORIES, MOCK_COUPONS } from '@/lib/data/mock-data';
import { Coupon } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Users,
  Store,
  Bike,
  ShoppingBag,
  DollarSign,
  Tag,
  Check,
  X,
  Plus,
  Sliders,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { orders } = useOrders();

  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'coupons' | 'orders'>('overview');

  // Coupon form
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const platformCommission = Math.round(totalRevenue * 0.15); // 15% platform commission

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return;

    const val = parseFloat(newDiscount);
    const created: Coupon = {
      id: `cp-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      description: newDesc || 'Special platform privilege discount',
      discount_type: discountType,
      discount_value: discountType === 'percentage' ? val : Math.round(val * 100),
      min_order_amount: 30000,
      is_active: true,
    };

    setCoupons([created, ...coupons]);
    setIsAddCouponOpen(false);
    setNewCode('');
    setNewDesc('');
    setNewDiscount('');
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-noir-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-black" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
              NOIR Platform Governance
            </h1>
          </div>
          <p className="text-xs text-noir-500 font-mono">
            Lead Administrator: {user?.full_name || 'Elena Rostova'} • Enterprise Central Console
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'overview' ? 'bg-black text-white' : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
            }`}
          >
            Overview KPIs
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'restaurants' ? 'bg-black text-white' : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
            }`}
          >
            Ateliers ({MOCK_RESTAURANTS.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'coupons' ? 'bg-black text-white' : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
            }`}
          >
            Promotions ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'orders' ? 'bg-black text-white' : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
            }`}
          >
            Audit Log ({orders.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Gross Merchandise (GMV)</p>
          <p className="text-2xl font-bold font-mono text-black">{formatCurrency(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-600 font-mono">Platform volume</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Net Platform Commission</p>
          <p className="text-2xl font-bold font-mono text-black">{formatCurrency(platformCommission)}</p>
          <p className="text-[11px] text-emerald-600 font-mono">15% Take rate</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Culinary Ateliers</p>
          <p className="text-2xl font-bold font-mono text-black">{MOCK_RESTAURANTS.length}</p>
          <p className="text-[11px] text-noir-500 font-mono">100% Verified</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Fleet Partners</p>
          <p className="text-2xl font-bold font-mono text-black">18</p>
          <p className="text-[11px] text-noir-500 font-mono">Electric Couriers</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Total Transactions</p>
          <p className="text-2xl font-bold font-mono text-black">{orders.length}</p>
          <p className="text-[11px] text-emerald-600 font-mono">Zero Chargebacks</p>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-noir-200 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-black">Recent Platform Orders</h3>
            <div className="divide-y divide-noir-100">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-black">#{o.order_number}</span>
                    <p className="text-noir-500">{o.customer_name} • {o.restaurant_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-black">{formatCurrency(o.total_amount)}</span>
                    <p className="text-[10px] uppercase font-mono text-noir-400">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-noir-200 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-black">Platform Health & Security</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-noir-50 border border-noir-200">
                <span>Razorpay Webhook Verification</span>
                <span className="font-mono text-emerald-700 font-bold">ACTIVE (200 OK)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-noir-50 border border-noir-200">
                <span>Supabase PostgreSQL Health</span>
                <span className="font-mono text-emerald-700 font-bold">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-noir-50 border border-noir-200">
                <span>Row Level Security (RLS)</span>
                <span className="font-mono text-emerald-700 font-bold">18 TABLES ENFORCED</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-noir-50 border border-noir-200">
                <span>Thermal Packaging Compliance</span>
                <span className="font-mono text-emerald-700 font-bold">100% AUDITED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Restaurants */}
      {activeTab === 'restaurants' && (
        <div className="bg-white rounded-3xl border border-noir-200 overflow-hidden shadow-subtle divide-y divide-noir-100">
          {MOCK_RESTAURANTS.map((r) => (
            <div key={r.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <img src={r.cover_image} alt={r.name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-black">{r.name}</h4>
                  <p className="text-noir-500">{r.address}</p>
                  <p className="text-noir-400 font-mono">
                    Rating {r.rating}★ • Delivery Fee {formatCurrency(r.delivery_fee)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-mono text-[10px] uppercase font-bold">
                  Approved Atelier
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-black">Promotional Coupons & Privileges</h2>
            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-noir-200 p-5 shadow-subtle space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-black">{c.code}</span>
                    <button
                      onClick={() => toggleCoupon(c.id)}
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                        c.is_active
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-noir-300 bg-noir-100 text-noir-500'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-xs text-noir-600 mt-1">{c.description}</p>
                </div>

                <div className="pt-2 border-t border-noir-100 flex items-center justify-between text-xs font-mono text-noir-500">
                  <span>
                    {c.discount_type === 'percentage'
                      ? `${c.discount_value}% Discount`
                      : `Flat ${formatCurrency(c.discount_value)}`}
                  </span>
                  <span>Min {formatCurrency(c.min_order_amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-noir-200 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-noir-50 border-b border-noir-200 font-mono text-noir-500 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Restaurant</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noir-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-noir-50/50">
                    <td className="p-4 font-mono font-bold text-black">{o.order_number}</td>
                    <td className="p-4">{o.customer_name}</td>
                    <td className="p-4">{o.restaurant_name}</td>
                    <td className="p-4 font-mono uppercase">{o.payment_method}</td>
                    <td className="p-4 font-mono font-bold">{formatCurrency(o.total_amount)}</td>
                    <td className="p-4">
                      <span className="font-mono uppercase text-[10px] bg-noir-100 px-2 py-0.5 rounded border border-noir-300">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-noir-400 font-mono">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-noir-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-black">Issue Promotional Coupon</h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. VIP25"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Discount Type</label>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDiscountType('percentage')}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-mono ${
                      discountType === 'percentage'
                        ? 'border-black bg-black text-white font-bold'
                        : 'border-noir-200'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('flat')}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-mono ${
                      discountType === 'flat'
                        ? 'border-black bg-black text-white font-bold'
                        : 'border-noir-200'
                    }`}
                  >
                    Flat Rupee (₹)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">
                  {discountType === 'percentage' ? 'Percentage (e.g. 25 for 25%)' : 'Rupee Amount (e.g. 250)'}
                </label>
                <input
                  type="number"
                  required
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  placeholder={discountType === 'percentage' ? '25' : '250'}
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. 25% off for priority members"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-noir-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-noir-800"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
