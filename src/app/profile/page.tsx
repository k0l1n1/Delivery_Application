'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth-context';
import { useOrders } from '@/lib/store/order-store';
import { useCart } from '@/lib/store/cart-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MOCK_RESTAURANTS, DELIVERY_LOCATIONS } from '@/lib/data/mock-data';
import {
  Building2,
  Package,
  Heart,
  LogOut,
  Plus,
  Trash2,
  ArrowRight,
  RotateCcw,
  Check,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, addresses, addAddress, deleteAddress, setDefaultAddress, logout } = useAuth();
  const { orders } = useOrders();
  const { addItem, clearCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'favorites'>('orders');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newBuilding, setNewBuilding] = useState(DELIVERY_LOCATIONS[0]);
  const [newBlock, setNewBlock] = useState('Block B');
  const [newFloor, setNewFloor] = useState('2nd Floor');
  const [newRoom, setNewRoom] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold">Please sign in to view your profile</h2>
        <Link
          href="/auth/login"
          className="inline-block px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.trim()) return;

    addAddress({
      label: 'Campus Desk',
      building_name: newBuilding,
      block_wing: newBlock,
      floor: newFloor,
      room_number: newRoom.startsWith('Room') || newRoom.startsWith('Desk') ? newRoom : `Desk/Room ${newRoom}`,
      landmark: newLandmark,
      is_default: false,
    });

    setIsAddAddressOpen(false);
    setNewRoom('');
    setNewLandmark('');
  };

  const handleReorder = (order: (typeof orders)[0]) => {
    clearCart();
    const rest = MOCK_RESTAURANTS.find((r) => r.id === order.restaurant_id) || MOCK_RESTAURANTS[0];
    order.items.forEach((item) => {
      const foodItem = rest.items?.find((i) => i.id === item.food_item_id) || {
        id: item.food_item_id,
        restaurant_id: order.restaurant_id,
        name: item.food_name,
        slug: 'item',
        description: '',
        price: item.unit_price,
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
        is_veg: true,
        is_available: true,
      };
      addItem(foodItem, { id: rest.id, name: rest.name, delivery_fee: rest.delivery_fee }, item.selected_customizations, item.quantity);
    });
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-noir-200 p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-black text-white font-mono text-xl font-bold flex items-center justify-center">
            {user.full_name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-black">{user.full_name}</h1>
              <span className="text-[10px] font-mono uppercase bg-noir-100 text-black px-2 py-0.5 rounded-full border border-noir-300">
                {user.roll_number || 'Campus Member'}
              </span>
            </div>
            <p className="text-xs text-noir-500 font-mono">
              {user.email} {user.phone ? `• ${user.phone}` : ''}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-noir-300 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-noir-200 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'orders' ? 'bg-black text-white' : 'text-noir-600 hover:bg-noir-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'addresses' ? 'bg-black text-white' : 'text-noir-600 hover:bg-noir-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'favorites' ? 'bg-black text-white' : 'text-noir-600 hover:bg-noir-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorite Outlets</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-noir-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-black">
                      #{order.order_number}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-noir-100 text-black border border-noir-300'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-black">{order.restaurant_name}</p>
                  <p className="text-xs text-noir-600">
                    Delivered to: <strong className="text-black">{order.delivery_address.room_number || 'Desk'}</strong>, {order.delivery_address.building_name}
                  </p>
                  <p className="text-xs text-noir-500 font-mono">
                    {order.items.map((i) => `${i.quantity}x ${i.food_name}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-noir-400 font-mono">
                    {formatDate(order.created_at)} • Total {formatCurrency(order.total_amount)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-noir-300 bg-white hover:bg-noir-100 text-xs font-semibold text-black transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold transition-colors"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-noir-50 rounded-3xl border border-noir-200 space-y-2">
              <p className="font-bold text-black">No past orders found</p>
              <p className="text-xs text-noir-500">Your recent food orders will appear here.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-black">Your Registered Addresses</h3>
            <button
              onClick={() => setIsAddAddressOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Location</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-2xl border border-noir-200 p-5 shadow-subtle space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-xs uppercase text-black">
                      {addr.room_number || addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="text-[10px] font-mono uppercase bg-noir-100 text-black px-2 py-0.5 rounded-full border border-noir-300">
                        Primary Address
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-black">{addr.building_name}</p>
                  <p className="text-xs text-noir-600 font-mono">
                    {addr.block_wing} • {addr.floor}
                  </p>
                  {addr.landmark && <p className="text-xs text-noir-400 italic">Near: {addr.landmark}</p>}
                </div>

                <div className="pt-2 border-t border-noir-100 flex items-center justify-between">
                  {!addr.is_default ? (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-xs text-noir-600 hover:text-black font-semibold font-mono"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected Default
                    </span>
                  )}
                  {addresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-noir-400 hover:text-red-600 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_RESTAURANTS.slice(0, 2).map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-noir-200 p-4 flex gap-4 items-center shadow-subtle"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0">
                <img src={r.cover_image} alt={r.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-sm">{r.name}</h4>
                <p className="text-xs text-noir-500">{r.cuisines.join(' • ')}</p>
                <p className="text-xs font-mono font-bold">{r.rating}★ ({r.rating_count} reviews)</p>
              </div>
              <Link
                href={`/restaurants/${r.slug}`}
                className="px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold"
              >
                Order
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-noir-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-black">Register Delivery Location</h3>
            <form onSubmit={handleCreateAddress} className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Location / Building</label>
                <select
                  value={newBuilding}
                  onChange={(e) => setNewBuilding(e.target.value)}
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
                    placeholder="Block B"
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
                <label className="text-xs font-mono uppercase text-noir-500">Desk / Room Number</label>
                <input
                  type="text"
                  required
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="e.g. Desk 42, Room 304"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Landmark</label>
                <input
                  type="text"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="Near staircase / lift"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-noir-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-noir-800"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
