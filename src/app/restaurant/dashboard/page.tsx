'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/store/auth-context';
import { useOrders } from '@/lib/store/order-store';
import { MOCK_RESTAURANTS } from '@/lib/data/mock-data';
import { FoodItem } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Store,
  ChefHat,
  Plus,
  Trash2,
  Building2,
  Package,
} from 'lucide-react';

export default function RestaurantOwnerDashboard() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  const [restaurant, setRestaurant] = useState(MOCK_RESTAURANTS[0]);
  const [items, setItems] = useState<FoodItem[]>(restaurant.items || []);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics'>('orders');

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemVeg, setNewItemVeg] = useState(true);
  const [newItemCategory, setNewItemCategory] = useState('Midnight Snacks');

  const restaurantOrders = orders.filter((o) => o.restaurant_id === restaurant.id || true);

  const toggleItemAvailability = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, is_available: !i.is_available } : i))
    );
  };

  const deleteMenuItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const created: FoodItem = {
      id: `item-${Date.now()}`,
      restaurant_id: restaurant.id,
      name: newItemName,
      slug: newItemName.toLowerCase().replace(/\s+/g, '-'),
      description: newItemDesc,
      price: Math.round(parseFloat(newItemPrice) * 100),
      image_url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
      is_veg: newItemVeg,
      is_available: true,
      category_name: newItemCategory,
      preparation_time_minutes: 10,
    };

    setItems([created, ...items]);
    setIsAddItemOpen(false);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
  };

  const totalRevenue = restaurantOrders.reduce((acc, o) => acc + o.subtotal_amount, 0);
  const activeOrdersCount = restaurantOrders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-noir-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-black" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
              {restaurant.name} Kitchen Portal
            </h1>
          </div>
          <p className="text-xs text-noir-500 font-mono">
            Kitchen Incharge: {user?.full_name || 'Kitchen Staff'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'orders' ? 'bg-black text-white' : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
            }`}
          >
            Kitchen Tickets ({activeOrdersCount})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'menu' ? 'bg-black text-white' : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
            }`}
          >
            Menu Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'analytics' ? 'bg-black text-white' : 'bg-noir-100 text-noir-700 hover:bg-noir-200'
            }`}
          >
            Sales Analytics
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Revenue</p>
          <p className="text-2xl font-bold font-mono text-black">{formatCurrency(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-600 font-mono">From recorded orders</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Active Orders</p>
          <p className="text-2xl font-bold font-mono text-black">{activeOrdersCount}</p>
          <p className="text-[11px] text-noir-500 font-mono">Awaiting dispatch</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Total Orders</p>
          <p className="text-2xl font-bold font-mono text-black">{restaurantOrders.length}</p>
          <p className="text-[11px] text-noir-500 font-mono">Lifetime volume</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-noir-200 shadow-subtle space-y-1">
          <p className="text-xs font-mono uppercase text-noir-500">Active Menu Items</p>
          <p className="text-2xl font-bold font-mono text-black">{items.filter((i) => i.is_available).length} / {items.length}</p>
          <p className="text-[11px] text-noir-500 font-mono">Available for ordering</p>
        </div>
      </div>

      {/* Tab 1: Live Kitchen Tickets */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-black">Active Orders for Dispatch</h2>

          <div className="space-y-4">
            {restaurantOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-noir-200 p-6 shadow-subtle space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-noir-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-base text-black">
                      #{order.order_number}
                    </span>
                    <span className="text-xs text-noir-500 ml-2 font-mono">
                      {order.customer_name} ({order.student_roll_no || 'Student'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase bg-noir-100 text-black px-3 py-1 rounded-full border border-noir-300 font-bold">
                      Status: {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-2">
                    {/* Destination Room */}
                    <div className="flex items-center gap-2 text-xs bg-noir-50 p-2.5 rounded-xl border border-noir-200">
                      <Building2 className="w-4 h-4 text-black flex-shrink-0" />
                      <div>
                        <strong className="text-black">
                          {order.delivery_address.room_number || 'Desk'} • {order.delivery_address.floor || 'Floor'}
                        </strong>
                        <span className="text-noir-600 ml-1">
                          ({order.delivery_address.building_name}, {order.delivery_address.block_wing})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {order.items.map((i) => (
                        <div key={i.id} className="text-xs flex items-center justify-between">
                          <span className="font-semibold text-black">
                            {i.quantity}x {i.food_name}
                          </span>
                          <span className="font-mono text-noir-600">{formatCurrency(i.total_price)}</span>
                        </div>
                      ))}
                    </div>

                    {order.special_instructions && (
                      <p className="text-xs text-noir-500 italic bg-noir-50 p-2 rounded-xl border border-noir-200">
                        Student Note: &ldquo;{order.special_instructions}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-4 flex flex-col gap-2">
                    {order.status === 'placed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="w-full py-2.5 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold transition-colors"
                      >
                        Accept & Start Cooking
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="w-full py-2.5 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ChefHat className="w-4 h-4" /> Thermal Pack & Seal
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full py-2.5 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-semibold transition-colors"
                      >
                        Mark Ready for Campus Runner
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        className="w-full py-2.5 rounded-full bg-black text-white text-xs font-semibold transition-colors"
                      >
                        Handover to Runner
                      </button>
                    )}
                    {order.status === 'out_for_delivery' && (
                      <span className="text-center text-xs font-mono text-noir-500 py-2">
                        Runner climbing to {order.delivery_address.room_number || 'Room'}
                      </span>
                    )}
                    {order.status === 'delivered' && (
                      <span className="text-center text-xs font-mono text-emerald-600 py-2 font-bold">
                        Delivered to Student
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Manage Menu */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-black">Canteen Food Items</h2>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white hover:bg-noir-800 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Canteen Dish</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-noir-200 overflow-hidden shadow-subtle divide-y divide-noir-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-noir-100 relative flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 border ${
                          item.is_veg ? 'border-emerald-500' : 'border-rose-500'
                        } flex items-center justify-center p-0.5 rounded-sm`}
                      >
                        <span className={`w-1 h-1 rounded-full ${item.is_veg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      </span>
                      <h4 className="font-bold text-sm text-black">{item.name}</h4>
                    </div>
                    <p className="text-xs text-noir-500 line-clamp-1">{item.description}</p>
                    <span className="font-mono font-bold text-xs text-black">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      item.is_available
                        ? 'border-black bg-black text-white'
                        : 'border-noir-300 bg-white text-noir-400'
                    }`}
                  >
                    <span>{item.is_available ? 'Available' : 'Sold Out'}</span>
                  </button>

                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-1.5 text-noir-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-noir-200 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-black">Order Breakdown</h3>
            {restaurantOrders.length > 0 ? (
              <div className="divide-y divide-noir-100">
                {restaurantOrders.map((o) => (
                  <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-black">#{o.order_number}</span>
                      <p className="text-noir-500">
                        {o.delivery_address.room_number}, {o.delivery_address.building_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-black">{formatCurrency(o.total_amount)}</span>
                      <p className="text-[10px] uppercase font-mono text-noir-400">{o.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-noir-500 font-mono">
                No orders recorded yet. Live analytics will display here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-noir-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-black">Add Canteen Menu Dish</h3>

            <form onSubmit={handleAddNewItem} className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Schezwan Fried Maggi"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Student Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="70"
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Description</label>
                <textarea
                  required
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g. Double Maggi noodles with veggies and fiery schezwan sauce..."
                  rows={2}
                  className="w-full mt-1 p-2.5 rounded-xl border border-noir-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-noir-500">Dietary Type</label>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setNewItemVeg(true)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                      newItemVeg ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-noir-200'
                    }`}
                  >
                    Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItemVeg(false)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                      !newItemVeg ? 'border-rose-600 bg-rose-50 text-rose-800' : 'border-noir-200'
                    }`}
                  >
                    Non-Vegetarian
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-noir-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-noir-800"
                >
                  Add Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
