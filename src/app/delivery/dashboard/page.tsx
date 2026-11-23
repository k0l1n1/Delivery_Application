'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/store/auth-context';
import { useOrders } from '@/lib/store/order-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Bike,
  CheckCircle,
  Package,
} from 'lucide-react';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<'deliveries' | 'earnings'>('deliveries');

  // Orders that need courier action
  const availableOrders = orders.filter(
    (o) => o.status === 'ready' || o.status === 'out_for_delivery'
  );
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  const totalEarnings = completedOrders.length * 1500; // ₹15 per delivery payout

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-noir-200 p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-mono">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-black">
                {user?.full_name || 'Delivery Partner'}
              </h1>
              <span className="text-[10px] font-mono uppercase bg-noir-100 text-black px-2 py-0.5 rounded-full border border-noir-300">
                Courier On-Duty
              </span>
            </div>
            <p className="text-xs text-noir-500 font-mono">
              Campus Delivery Operations
            </p>
          </div>
        </div>

        {/* Availability Switch */}
        <div className="flex items-center gap-3 bg-noir-50 border border-noir-300 p-2.5 rounded-2xl self-start sm:self-auto">
          <span className="text-xs font-mono uppercase font-bold text-black">
            {isAvailable ? 'Courier Active' : 'Off-Duty'}
          </span>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              isAvailable ? 'bg-black' : 'bg-noir-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isAvailable ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Payout Earned</p>
          <p className="text-2xl font-bold font-mono text-black">{formatCurrency(totalEarnings)}</p>
          <p className="text-[11px] text-emerald-600 font-mono">Calculated from deliveries</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Deliveries Completed</p>
          <p className="text-2xl font-bold font-mono text-black">{completedOrders.length}</p>
          <p className="text-[11px] text-noir-500 font-mono">Total drop-offs</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Active Queue</p>
          <p className="text-2xl font-bold font-mono text-black">{availableOrders.length}</p>
          <p className="text-[11px] text-emerald-600 font-mono">Awaiting courier action</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-noir-200 pb-3">
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'deliveries' ? 'bg-black text-white' : 'text-noir-600 hover:bg-noir-100'
          }`}
        >
          Active Deliveries ({availableOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'earnings' ? 'bg-black text-white' : 'text-noir-600 hover:bg-noir-100'
          }`}
        >
          Payout Records ({completedOrders.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
          {availableOrders.length > 0 ? (
            availableOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-noir-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-black">#{order.order_number}</span>
                    <span className="text-[10px] font-mono uppercase bg-noir-100 px-2.5 py-0.5 rounded-full border border-noir-300">
                      {order.status === 'ready' ? 'Ready for Pickup' : 'In Transit'}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-black">
                    Payout: ₹15.00
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Pickup */}
                  <div className="space-y-1 bg-noir-50 p-4 rounded-2xl border border-noir-200">
                    <span className="font-mono uppercase text-[10px] text-noir-500">
                      Step 1: Pick Up Location
                    </span>
                    <p className="font-bold text-black">{order.restaurant_name}</p>
                    <p className="text-noir-600">Student Activity Center (SAC) Kitchen</p>
                  </div>

                  {/* Drop-off */}
                  <div className="space-y-1 bg-noir-50 p-4 rounded-2xl border border-noir-200">
                    <span className="font-mono uppercase text-[10px] text-noir-500">
                      Step 2: Drop-off Destination
                    </span>
                    <p className="font-bold text-black text-sm">
                      {order.delivery_address.room_number || 'Desk'} • {order.delivery_address.floor || 'Floor'}
                    </p>
                    <p className="font-semibold text-black">{order.delivery_address.building_name}</p>
                    <p className="text-noir-500 font-mono">
                      Recipient: {order.customer_name} ({order.student_roll_no || 'Campus Member'})
                    </p>
                    {order.special_instructions && (
                      <p className="text-[11px] text-noir-600 italic mt-1">
                        &ldquo;{order.special_instructions}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-3 pt-2">
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                      className="flex-1 py-3 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Pick Up Thermal Box & Start Delivery</span>
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="flex-1 py-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Handover at Destination</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-noir-50 rounded-3xl border border-noir-200 space-y-2">
              <p className="font-bold text-black">No active deliveries</p>
              <p className="text-xs text-noir-500">
                Wait near Central Hub kitchen; incoming orders will notify you immediately.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-noir-200 divide-y divide-noir-100 overflow-hidden shadow-subtle">
            {completedOrders.map((o) => (
              <div key={o.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-black">#{o.order_number}</span>
                  <p className="text-noir-500">
                    Delivered to {o.delivery_address.room_number}, {o.delivery_address.building_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-600">+₹15.00</span>
                  <p className="text-[10px] text-noir-400 font-mono">{formatDate(o.updated_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
