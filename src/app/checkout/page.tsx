'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/cart-store';
import { useAuth } from '@/lib/store/auth-context';
import { useOrders } from '@/lib/store/order-store';
import { formatCurrency, generateOrderNumber } from '@/lib/utils';
import { PaymentMethod, Address } from '@/types/database';
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  Check,
  Plus,
  ArrowRight,
  Loader2,
  Lock,
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
  const { addresses, addAddress, user } = useAuth();
  const { createOrder } = useOrders();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // New address form state
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold">No active items to checkout</h2>
        <button
          onClick={() => router.push('/restaurants')}
          className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newPostal.trim()) return;

    addAddress({
      label: newLabel,
      street_address: newStreet,
      landmark: newLandmark,
      city: 'Mumbai',
      postal_code: newPostal,
      is_default: true,
    });

    setIsAddAddressModalOpen(false);
    setNewStreet('');
    setNewLandmark('');
    setNewPostal('');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address to proceed.');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'cod') {
        // Cash on delivery
        const orderNumber = generateOrderNumber();
        const order = createOrder({
          order_number: orderNumber,
          user_id: user?.id || 'guest',
          customer_name: user?.full_name || 'Guest Connoisseur',
          customer_phone: user?.phone || '+91 98200 12345',
          restaurant_id: restaurantId || 'rest-1',
          restaurant_name: restaurantName || "L'Atelier Noir",
          delivery_address: selectedAddress,
          status: 'placed',
          subtotal_amount: subtotal,
          delivery_fee: deliveryFee,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          payment_method: 'cod',
          payment_status: 'pending',
          special_instructions: cookingInstructions,
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
        return;
      }

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

      // Check if Razorpay script is loaded and real key is present
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const hasRealKey =
        razorpayKey && !razorpayKey.includes('sample') && typeof window.Razorpay !== 'undefined';

      if (hasRealKey) {
        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'NOIR Gastronomy',
          description: `Gourmet Order from ${restaurantName}`,
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
              alert('Payment signature verification failed. Please contact concierge.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user?.full_name || 'Alexander Vance',
            email: user?.email || 'alexander@noir.luxury',
            contact: user?.phone || '9820012345',
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
        // High fidelity test simulator verification
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
      user_id: user?.id || 'guest',
      customer_name: user?.full_name || 'Alexander Vance',
      customer_phone: user?.phone || '+91 98200 12345',
      restaurant_id: restaurantId || 'rest-1',
      restaurant_name: restaurantName || "L'Atelier Noir",
      delivery_address: selectedAddress,
      status: 'placed',
      subtotal_amount: subtotal,
      delivery_fee: deliveryFee,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: method,
      payment_status: payStatus,
      special_instructions: cookingInstructions,
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
        <span className="text-xs font-mono uppercase tracking-widest text-noir-500">Checkout</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-black mt-1">Review & Confirm Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Address Selection */}
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-mono">
                  1
                </div>
                <h3 className="font-bold text-sm text-black">Delivery Residence</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddressModalOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold text-black hover:text-noir-600 font-mono transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-colors space-y-1 ${
                      isSelected
                        ? 'border-black bg-noir-50 text-black shadow-sm'
                        : 'border-noir-200 hover:border-noir-300 text-noir-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider font-mono text-[11px] text-black">
                        {addr.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-black" />}
                    </div>
                    <p className="line-clamp-2">{addr.street_address}</p>
                    <p className="text-[11px] text-noir-500 font-mono">
                      {addr.city} • {addr.postal_code}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Instructions */}
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-mono">
                2
              </div>
              <h3 className="font-bold text-sm text-black">Chef & Courier Instructions</h3>
            </div>
            <textarea
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              placeholder="e.g. Please arrange extra napkins, cutlery, or instructions for entering through the residential concierge gate..."
              rows={2}
              className="w-full p-3 rounded-2xl border border-noir-300 bg-noir-50 focus:bg-white focus:outline-none focus:border-black text-xs text-black"
            />
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-mono">
                3
              </div>
              <h3 className="font-bold text-sm text-black">Select Payment Option</h3>
            </div>

            <div className="space-y-3">
              {/* Razorpay */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-2xl border cursor-pointer transition-colors flex items-center justify-between ${
                  paymentMethod === 'razorpay'
                    ? 'border-black bg-noir-50 shadow-sm'
                    : 'border-noir-200 hover:border-noir-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-black text-white">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-black">
                      Razorpay Gateway (UPI, Cards, NetBanking)
                    </h4>
                    <p className="text-[11px] text-noir-500">
                      256-bit encrypted checkout with instant refund protection.
                    </p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'razorpay' ? 'border-black bg-black text-white' : 'border-noir-300'
                  }`}
                >
                  {paymentMethod === 'razorpay' && <Check className="w-2.5 h-2.5" />}
                </div>
              </div>

              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer transition-colors flex items-center justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-black bg-noir-50 shadow-sm'
                    : 'border-noir-200 hover:border-noir-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-noir-800 text-white">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-black">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-noir-500">
                      Pay via cash or UPI upon handover by the courier.
                    </p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-black bg-black text-white' : 'border-noir-300'
                  }`}
                >
                  {paymentMethod === 'cod' && <Check className="w-2.5 h-2.5" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Confirmation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-black">Review Order Breakdown</h3>

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
                <span>Subtotal</span>
                <span className="font-mono text-black">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-noir-600">
                <span>Delivery Charge</span>
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
                  <span>Privilege Code Discount</span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-noir-200 flex items-center justify-between text-base font-bold text-black">
                <span>Total to Pay</span>
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
                  <span>Authorizing Secure Transaction...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize & Place Order • {formatCurrency(totalAmount)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-noir-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-black">Add New Delivery Residence</h3>

            <form onSubmit={handleAddNewAddress} className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Label</label>
                <div className="flex gap-2 pt-1">
                  {(['Home', 'Work', 'Other'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setNewLabel(l)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono ${
                        newLabel === l
                          ? 'border-black bg-black text-white font-bold'
                          : 'border-noir-200 text-noir-700'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Street Address</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="e.g. Flat 601, Altamount Terrace"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs text-black"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Landmark (Optional)</label>
                <input
                  type="text"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="Near South Promenade"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs text-black"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Postal Code</label>
                <input
                  type="text"
                  required
                  value={newPostal}
                  onChange={(e) => setNewPostal(e.target.value)}
                  placeholder="400026"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs text-black"
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
