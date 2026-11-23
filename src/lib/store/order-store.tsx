'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/database';
import { MOCK_INITIAL_ORDERS } from '@/lib/data/mock-data';

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('millet_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save orders to localStorage
  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    try {
      localStorage.setItem('millet_orders', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id === orderId || o.order_number === orderId);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => {
      if (o.id === orderId || o.order_number === orderId) {
        return {
          ...o,
          status: newStatus,
          updated_at: new Date().toISOString(),
          delivered_at: newStatus === 'delivered' ? new Date().toISOString() : o.delivered_at,
        };
      }
      return o;
    });
    saveOrders(updated);
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
