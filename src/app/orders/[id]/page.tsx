'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useOrders } from '@/lib/store/order-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatus } from '@/types/database';
import {
  CheckCircle2,
  Building2,
  Phone,
  Bike,
  ShieldCheck,
  Package,
  Store,
  ChefHat,
  PartyPopper,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { getOrderById, updateOrderStatus } = useOrders();

  const [order, setOrder] = useState(() => getOrderById(orderId));

  useEffect(() => {
    const found = getOrderById(orderId);
    if (found) {
      setOrder(found);
    }
  }, [orderId, getOrderById]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-xs text-noir-500">
          The order ID &ldquo;{orderId}&rdquo; was not found in records.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const stages: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'placed', label: 'Order Sent to Kitchen', icon: <Package className="w-4 h-4" />, desc: 'Ticket received by kitchen staff' },
    { key: 'confirmed', label: 'Kitchen Confirmed', icon: <Store className="w-4 h-4" />, desc: 'Cooking station preparing ingredients' },
    { key: 'preparing', label: 'Cooking & Thermal Packing', icon: <ChefHat className="w-4 h-4" />, desc: 'Wholesome meal packed fresh' },
    { key: 'ready', label: 'Assigned to Cafe Courier', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Handed over to delivery courier' },
    { key: 'out_for_delivery', label: 'Courier on the Way', icon: <Bike className="w-4 h-4" />, desc: 'Approaching your building' },
    { key: 'delivered', label: 'Delivered to Doorstep', icon: <PartyPopper className="w-4 h-4" />, desc: 'Handed over at your desk / door' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.status);

  const handleAdvanceStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1].key;
      updateOrderStatus(order.id, nextStage);
      setOrder((prev) => (prev ? { ...prev, status: nextStage } : prev));
    }
  };

  const handleResetStage = () => {
    updateOrderStatus(order.id, 'placed');
    setOrder((prev) => (prev ? { ...prev, status: 'placed' } : prev));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Simulation Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-noir-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-noir-500">
              Live Order Telemetry
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black mt-1">
            Order #{order.order_number}
          </h1>
          <p className="text-xs text-noir-500 font-mono mt-0.5">
            Placed on {formatDate(order.created_at)} • {order.restaurant_name}
          </p>
        </div>

        {/* Live Simulation Test Bar */}
        <div className="flex items-center gap-2 bg-noir-100 p-2 rounded-2xl border border-noir-300">
          <span className="text-[11px] font-mono uppercase text-noir-600 px-2 font-medium">
            Courier Simulation:
          </span>
          <button
            onClick={handleAdvanceStage}
            disabled={order.status === 'delivered'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white hover:bg-noir-800 disabled:bg-noir-300 text-xs font-semibold transition-colors"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Advance Stage</span>
          </button>
          <button
            onClick={handleResetStage}
            title="Reset to placed status"
            className="p-1.5 rounded-xl hover:bg-noir-200 text-noir-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real-time Stages & Campus Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status Tracker */}
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-noir-400">Order Stage</p>
                <h3 className="text-lg font-bold text-black capitalize">
                  {stages[currentStageIndex]?.label || order.status}
                </h3>
              </div>

              <div className="text-right">
                <p className="text-xs font-mono uppercase text-noir-400">Estimated Delivery</p>
                <p className="text-lg font-bold font-mono text-black">
                  {order.status === 'delivered' ? 'Delivered' : '8-14 mins'}
                </p>
              </div>
            </div>

            {/* Stepper sequence */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-noir-200">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.key} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isCurrent
                          ? 'border-black bg-black text-white scale-110 shadow-sm'
                          : isPassed
                          ? 'border-black bg-black text-white'
                          : 'border-noir-300 bg-white'
                      }`}
                    >
                      {isPassed && <CheckCircle2 className="w-3 h-3" />}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent ? 'text-black' : isPassed ? 'text-noir-800' : 'text-noir-400'
                          }`}
                        >
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-noir-100 text-black border border-noir-300">
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-noir-500">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Campus Route Map */}
          <div className="bg-white rounded-3xl border border-noir-200 overflow-hidden shadow-subtle">
            <div className="p-4 border-b border-noir-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-black" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">
                  Courier Telemetry & Campus Transit
                </h4>
              </div>
              <span className="text-[11px] font-mono text-noir-500">Live Campus Path</span>
            </div>

            <div className="relative h-64 sm:h-72 w-full bg-noir-100 flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300">
                <path
                  d="M 120 180 Q 250 80, 480 140"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />

                {/* Cafe Kitchen Node */}
                <g transform="translate(120, 180)">
                  <circle r="14" fill="#000000" />
                  <circle r="6" fill="#FFFFFF" />
                  <text y="-20" textAnchor="middle" fill="#000000" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    MILLET CAFE Kitchen
                  </text>
                </g>

                {/* Delivery Node */}
                <g transform="translate(480, 140)">
                  <circle r="14" fill="#000000" />
                  <circle r="6" fill="#FFFFFF" />
                  <text y="-20" textAnchor="middle" fill="#000000" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    {order.delivery_address.room_number || 'Desk'} ({order.delivery_address.building_name?.split(' ')[0] || 'Drop'})
                  </text>
                </g>

                {/* Courier marker */}
                <g
                  transform={`translate(${
                    currentStageIndex <= 2
                      ? 140
                      : currentStageIndex === 3
                      ? 230
                      : currentStageIndex === 4
                      ? 370
                      : 480
                  }, ${
                    currentStageIndex <= 2
                      ? 170
                      : currentStageIndex === 3
                      ? 110
                      : currentStageIndex === 4
                      ? 115
                      : 140
                  })`}
                  className="transition-all duration-700 ease-in-out"
                >
                  <circle r="18" fill="#000000" className="animate-ping opacity-25" />
                  <circle r="12" fill="#000000" />
                  <circle r="4" fill="#FFFFFF" />
                  <text y="24" textAnchor="middle" fill="#000000" fontSize="9" fontFamily="monospace">
                    Campus Cycle #14
                  </text>
                </g>
              </svg>

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-noir-200 text-[10px] font-mono text-black">
                {order.delivery_address.building_name} • {order.delivery_address.block_wing}
              </div>
            </div>

            {/* Courier Profile */}
            <div className="p-4 bg-noir-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-noir-200 border border-noir-300">
                  <Image
                    src={
                      order.delivery_partner?.avatar_url ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                    }
                    alt="Courier"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-black">
                    {order.delivery_partner?.name || 'Assigned Courier'}
                  </h4>
                  <p className="text-[11px] text-noir-500 font-mono">
                    {order.delivery_partner?.vehicle_number || 'Express Courier'}
                  </p>
                </div>
              </div>

              {order.delivery_partner?.phone && (
                <a
                  href={`tel:${order.delivery_partner.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-noir-300 text-xs font-semibold text-black hover:bg-noir-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Courier</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ordered Food & Delivery Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Details */}
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-black">Food Selection</h3>

            <div className="divide-y divide-noir-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-black">
                      {item.quantity}x {item.food_name}
                    </span>
                    {item.selected_customizations && item.selected_customizations.length > 0 && (
                      <p className="text-[10px] text-noir-500">
                        {item.selected_customizations.map((c) => c.option_name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono text-noir-800">{formatCurrency(item.total_price)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-noir-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-noir-600">
                <span>Food Total</span>
                <span className="font-mono text-black">{formatCurrency(order.subtotal_amount)}</span>
              </div>
              <div className="flex items-center justify-between text-noir-600">
                <span>Courier Fee</span>
                <span className="font-mono text-black">
                  {order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-noir-600">
                <span>GST (5%)</span>
                <span className="font-mono text-black">{formatCurrency(order.tax_amount)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-mono">-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-noir-200 flex items-center justify-between text-sm font-bold text-black">
                <span>Grand Total</span>
                <span className="font-mono">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-noir-100 flex items-center justify-between text-[11px] font-mono text-noir-500">
              <span>Method: {order.payment_method.toUpperCase()}</span>
              <span className="text-emerald-700 font-bold uppercase">
                {order.payment_status}
              </span>
            </div>
          </div>

          {/* Destination Details */}
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-black" />
              <h3 className="font-bold text-sm text-black">Delivery Location</h3>
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-black text-sm">
                {order.delivery_address.room_number || 'Desk'} • {order.delivery_address.floor || 'Floor'}
              </p>
              <p className="text-noir-800 font-semibold">{order.delivery_address.building_name}</p>
              <p className="text-noir-600">{order.delivery_address.block_wing}</p>
              {order.student_roll_no && (
                <p className="text-noir-500 font-mono">Roll No: {order.student_roll_no}</p>
              )}
            </div>
            {order.special_instructions && (
              <div className="pt-2 border-t border-noir-100 text-xs">
                <span className="font-mono uppercase text-[10px] text-noir-400">Delivery Note:</span>
                <p className="text-noir-700 italic mt-0.5">&ldquo;{order.special_instructions}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
