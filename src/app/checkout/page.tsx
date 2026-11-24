'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/cart-store';
import { useAuth } from '@/lib/store/auth-context';
import { useOrders } from '@/lib/store/order-store';
import { formatCurrency, generateOrderNumber } from '@/lib/utils';
import { PaymentMethod } from '@/types/database';
import { DELIVERY_LOCATIONS } from '@/lib/data/mock-data';
import {
  CreditCard,
  Check,
  Plus,
  Loader2,
  Lock,
  ArrowRight,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    restaurantId,
    restaurantName,
    subtotal,
    deliveryFee,
    taxAmount,
    discountAmount,
    totalAmount,
    clearCart,
  } = useCart();
  const { addresses, addAddress, user, isLoading: authLoading } = useAuth();
  const { createOrder } = useOrders();

  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [studentRoll, setStudentRoll] = useState(user?.roll_number || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // New address form
  const [newBuildingName, setNewBuildingName] = useState(DELIVERY_LOCATIONS[0]);
  const [newBlock, setNewBlock] = useState('Block B');
  const [newFloor, setNewFloor] = useState('2nd Floor');
  const [newRoom, setNewRoom] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  // Sync user profile once authenticated
  useEffect(() => {
    if (user) {
      if (!customerName && user.full_name) setCustomerName(user.full_name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
      if (!studentRoll && user.roll_number) setStudentRoll(user.roll_number);
    }
  }, [user]);

  // Auth gate: redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-noir-400" />
        <p className="text-xs font-mono text-noir-500">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-noir-100 dark:bg-noir-900 border border-noir-200 dark:border-noir-800 flex items-center justify-center mx-auto text-black dark:text-white">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">Sign In Required</h2>
          <p className="text-xs text-noir-500 dark:text-noir-400 font-mono">
            You must have an account to place and track your campus delivery order.
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <Link
            href="/auth/login?redirect=/checkout"
            className="w-full py-3.5 rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-noir-800 dark:hover:bg-noir-200 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors"
          >
            <span>Sign In to Continue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/signup?redirect=/checkout"
            className="w-full py-3.5 rounded-full border border-noir-300 dark:border-noir-700 text-black dark:text-white hover:bg-noir-50 dark:hover:bg-noir-900 text-xs font-semibold tracking-wide flex items-center justify-center transition-colors"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold">No active items to checkout</h2>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold"
        >
          Browse Food Menu
        </button>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.trim()) return;

    addAddress({
      label: 'Campus Desk',
      building_name: newBuildingName,
      block_wing: newBlock,
      room_number: newRoom.startsWith('Room') || newRoom.startsWith('Desk') ? newRoom : `Desk/Room ${newRoom}`,
      floor: newFloor,
      landmark: newLandmark,
      is_default: true,
    });

    setIsAddAddressModalOpen(false);
    setNewRoom('');
    setNewLandmark('');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or register your delivery address.');
      return;
    }

    setIsProcessing(true);

    try {
      // Razorpay Payment Flow
      const createRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(orderData.error || 'Failed to initiate payment gateway');
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const hasRealKey =
        razorpayKey && !razorpayKey.includes('sample') && typeof window.Razorpay !== 'undefined';

      if (hasRealKey) {
        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'MILLET CAFE Food Delivery',
          description: `Order from ${restaurantName}`,
          order_id: orderData.id,
          handler: async (response: any) => {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              completeAndRedirectOrder('razorpay', 'completed');
            } else {
              alert('Payment verification failed. Please try again.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: customerName || user?.full_name || '',
            email: user?.email || '',
            contact: customerPhone || user?.phone || '',
          },
          theme: { color: '#000000' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', (resp: any) => {
          alert(`Payment failed: ${resp.error.description}`);
          setIsProcessing(false);
        });
      } else {
        // Simulation mode
        const simPaymentId = `pay_sim_${Date.now()}`;
        const verifyRes = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.id,
            razorpay_payment_id: simPaymentId,
            is_simulated: true,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          completeAndRedirectOrder('razorpay', 'completed');
        }
      }
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const completeAndRedirectOrder = (method: PaymentMethod, payStatus: 'completed' | 'pending') => {
    const orderNumber = generateOrderNumber();
    const order = createOrder({
      order_number: orderNumber,
      user_id: user?.id || 'guest-user',
      customer_name: customerName || user?.full_name || 'Customer',
      customer_phone: customerPhone || user?.phone || '',
      student_roll_no: studentRoll,
      restaurant_id: restaurantId || 'millet-main',
      restaurant_name: restaurantName || 'MILLET CAFE – Central Hub',
      delivery_address: selectedAddress,
      status: 'placed',
      subtotal_amount: subtotal,
      delivery_fee: deliveryFee,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: method,
      payment_status: payStatus,
      special_instructions: deliveryInstructions,
      items: items.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        order_id: '',
        food_item_id: item.food_item_id,
        food_name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        selected_customizations: item.selected_customizations,
      })),
    });

    clearCart();
    router.push(`/orders/${order.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-noir-500">Order Checkout</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-black mt-1">Confirm Delivery</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Address Selection */}
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-mono">
                  1
                </div>
                <h3 className="font-bold text-sm text-black">Delivery Location & Desk</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddressModalOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold text-black hover:text-noir-600 font-mono transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Location</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-6 text-center bg-noir-50 rounded-2xl border border-dashed border-noir-300 space-y-2">
                <p className="text-xs font-semibold text-black">No delivery address saved yet</p>
                <button
                  type="button"
                  onClick={() => setIsAddAddressModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-black text-white text-xs font-semibold"
                >
                  Add Your Delivery Location
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border text-xs cursor-pointer transition-colors space-y-1.5 ${
                        isSelected
                          ? 'border-black bg-noir-50 text-black shadow-sm'
                          : 'border-noir-200 hover:border-noir-300 text-noir-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-mono text-xs text-black">
                          {addr.room_number || addr.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-black" />}
                      </div>
                      <p className="font-semibold text-noir-900">{addr.building_name}</p>
                      <p className="text-[11px] text-noir-500 font-mono">
                        {addr.block_wing} • {addr.floor}
                      </p>
                      {addr.landmark && (
                        <p className="text-[10px] text-noir-400 italic">Near: {addr.landmark}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Student Roll No & Instructions */}
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-mono">
                2
              </div>
              <h3 className="font-bold text-sm text-black">Recipient Details & Notes</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-noir-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-noir-500">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Roll / ID Number (Optional)</label>
                <input
                  type="text"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  placeholder="Optional Student Roll or Employee ID"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Special instructions for the delivery courier..."
                  rows={2}
                  className="w-full mt-1 p-3 rounded-2xl border border-noir-300 bg-noir-50 focus:bg-white focus:outline-none focus:border-black text-xs text-black"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-mono">
                3
              </div>
              <h3 className="font-bold text-sm text-black">Payment Method</h3>
            </div>

            <div className="p-4 rounded-2xl border border-black bg-noir-50 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-black text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-black">
                      Razorpay Instant UPI & Cards (GPay, PhonePe, Paytm)
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      SECURE
                    </span>
                  </div>
                  <p className="text-[11px] text-noir-500 mt-0.5">
                    Scan QR or pay via any UPI app directly from your phone.
                  </p>
                </div>
              </div>
              <div className="w-4 h-4 rounded-full border border-black bg-black text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-black">Meal Summary</h3>

            <div className="divide-y divide-noir-100 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-black">
                      {item.quantity}x {item.name}
                    </span>
                    {item.selected_customizations.length > 0 && (
                      <p className="text-[10px] text-noir-500">
                        {item.selected_customizations.map((c) => c.option_name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono text-noir-800">{formatCurrency(item.total_price)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-noir-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-noir-600">
                <span>Food Subtotal</span>
                <span className="font-mono text-black">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-noir-600">
                <span>Delivery Courier Fee</span>
                <span className="font-mono text-black">
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-noir-600">
                <span>GST (5%)</span>
                <span className="font-mono text-black">{formatCurrency(taxAmount)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-noir-200 flex items-center justify-between text-base font-bold text-black">
                <span>Total Amount</span>
                <span className="font-mono">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 rounded-full bg-black text-white hover:bg-noir-800 disabled:bg-noir-400 transition-colors text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Placing Order with Kitchen...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confirm Order • {formatCurrency(totalAmount)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-noir-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-black">Register Delivery Location</h3>

            <form onSubmit={handleAddNewAddress} className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Delivery Location / Building</label>
                <select
                  value={newBuildingName}
                  onChange={(e) => setNewBuildingName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs bg-white"
                >
                  {DELIVERY_LOCATIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-noir-500">Block / Wing</label>
                  <input
                    type="text"
                    required
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    placeholder="Block B / Wing 2"
                    className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-noir-500">Floor</label>
                  <input
                    type="text"
                    required
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    placeholder="3rd Floor"
                    className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Room / Desk Number</label>
                <input
                  type="text"
                  required
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="e.g. Desk 42, Room 304, Lab 3"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Nearest Landmark / Desk Marker</label>
                <input
                  type="text"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="Near east elevator / reception"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-noir-300 text-xs font-semibold text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-noir-800"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
