'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, CartItemOption, FoodItem, Coupon } from '@/types/database';
import { MOCK_COUPONS } from '@/lib/data/mock-data';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  restaurantDeliveryFee: number;
  appliedCoupon: Coupon | null;
  subtotal: number; // in paise
  deliveryFee: number; // in paise
  taxAmount: number; // in paise (5% GST)
  discountAmount: number; // in paise
  totalAmount: number; // in paise
  itemCount: number;
  addItem: (
    item: FoodItem,
    restaurant: { id: string; name: string; delivery_fee: number },
    customizations?: CartItemOption[],
    quantity?: number
  ) => boolean;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [restaurantDeliveryFee, setRestaurantDeliveryFee] = useState<number>(4900);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Restore cart on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('noir_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setRestaurantId(parsed.restaurantId || null);
        setRestaurantName(parsed.restaurantName || null);
        setRestaurantDeliveryFee(parsed.restaurantDeliveryFee || 4900);
        setAppliedCoupon(parsed.appliedCoupon || null);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(
        'noir_cart',
        JSON.stringify({
          items,
          restaurantId,
          restaurantName,
          restaurantDeliveryFee,
          appliedCoupon,
        })
      );
    } catch {
      // ignore
    }
  }, [items, restaurantId, restaurantName, restaurantDeliveryFee, appliedCoupon]);

  const addItem = (
    item: FoodItem,
    restaurant: { id: string; name: string; delivery_fee: number },
    customizations: CartItemOption[] = [],
    quantity = 1
  ): boolean => {
    // Check if item is from a different restaurant
    if (restaurantId && restaurantId !== restaurant.id && items.length > 0) {
      const confirmed = window.confirm(
        `Your cart contains gourmet items from "${restaurantName}". Would you like to clear your current cart and start a fresh order from "${restaurant.name}"?`
      );
      if (!confirmed) return false;
      setItems([]);
    }

    setRestaurantId(restaurant.id);
    setRestaurantName(restaurant.name);
    setRestaurantDeliveryFee(restaurant.delivery_fee || 4900);

    // Calculate item unit price with customizations
    const optionsTotal = customizations.reduce((acc, opt) => acc + opt.price_in_paise, 0);
    const unitPrice = item.price + optionsTotal;

    // Generate unique ID based on food ID + sorted customization choices
    const customKey = customizations.map((c) => c.option_id).sort().join('-');
    const cartItemId = `${item.id}-${customKey || 'standard'}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId
            ? {
                ...i,
                quantity: i.quantity + quantity,
                total_price: (i.quantity + quantity) * i.unit_price,
              }
            : i
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          food_item_id: item.id,
          restaurant_id: restaurant.id,
          restaurant_name: restaurant.name,
          name: item.name,
          image_url: item.image_url,
          is_veg: item.is_veg,
          base_price: item.price,
          unit_price: unitPrice,
          quantity: quantity,
          selected_customizations: customizations,
          total_price: unitPrice * quantity,
        };
        return [...prev, newItem];
      }
    });

    return true;
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== cartItemId);
      if (filtered.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
        setAppliedCoupon(null);
      }
      return filtered;
    });
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity: newQuantity,
              total_price: item.unit_price * newQuantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.total_price, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (items.length === 0) return 0;
    // Waive delivery fee if subtotal exceeds ₹1,500
    if (subtotal >= 150000) return 0;
    return restaurantDeliveryFee;
  }, [items.length, subtotal, restaurantDeliveryFee]);

  const taxAmount = useMemo(() => {
    // 5% GST standard for restaurants
    return Math.round(subtotal * 0.05);
  }, [subtotal]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || items.length === 0) return 0;

    if (subtotal < appliedCoupon.min_order_amount) {
      return 0;
    }

    if (appliedCoupon.discount_type === 'percentage') {
      const discount = Math.round((subtotal * appliedCoupon.discount_value) / 100);
      if (appliedCoupon.max_discount_amount) {
        return Math.min(discount, appliedCoupon.max_discount_amount);
      }
      return discount;
    } else {
      return appliedCoupon.discount_value;
    }
  }, [appliedCoupon, subtotal, items.length]);

  const totalAmount = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal + deliveryFee + taxAmount - discountAmount);
  }, [items.length, subtotal, deliveryFee, taxAmount, discountAmount]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    const coupon = MOCK_COUPONS.find((c) => c.code === formatted && c.is_active);

    if (!coupon) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }

    if (subtotal < coupon.min_order_amount) {
      return {
        success: false,
        message: `Order must be at least ₹${coupon.min_order_amount / 100} to use this coupon.`,
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon "${coupon.code}" applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        restaurantDeliveryFee,
        appliedCoupon,
        subtotal,
        deliveryFee,
        taxAmount,
        discountAmount,
        totalAmount,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
