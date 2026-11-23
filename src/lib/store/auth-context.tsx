'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole, Address } from '@/types/database';
import { MOCK_ADDRESSES } from '@/lib/data/mock-data';

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  addresses: Address[];
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  signup: (email: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  addAddress: (address: Omit<Address, 'id' | 'user_id'>) => void;
  setDefaultAddress: (id: string) => void;
  deleteAddress: (id: string) => void;
}

const DEFAULT_USERS: Record<UserRole, Profile> = {
  customer: {
    id: 'user-customer-1',
    email: 'aman.verma@campus.edu',
    full_name: 'Aman Verma',
    roll_number: '2023CSB1042',
    phone: '+91 98200 54321',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString(),
  },
  restaurant_owner: {
    id: 'user-owner-1',
    email: 'kitchen.manager@campus.edu',
    full_name: 'Mr. Ramesh Chand (Kitchen Manager)',
    phone: '+91 98200 88990',
    role: 'restaurant_owner',
    avatar_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString(),
  },
  delivery_partner: {
    id: 'user-delivery-1',
    email: 'vikas.runner@campus.edu',
    full_name: 'Vikas Kumar (Courier)',
    phone: '+91 98765 11223',
    role: 'delivery_partner',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString(),
  },
  admin: {
    id: 'user-admin-1',
    email: 'warden.dining@campus.edu',
    full_name: 'Prof. S. K. Narayan (Platform Admin)',
    phone: '+91 99999 00000',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString(),
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');
  const [user, setUser] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('noir_user_role') as UserRole;
      const savedUser = localStorage.getItem('noir_user_profile');
      const savedAddresses = localStorage.getItem('noir_user_addresses');

      if (savedRole && DEFAULT_USERS[savedRole]) {
        setRole(savedRole);
        setUser(savedUser ? JSON.parse(savedUser) : DEFAULT_USERS[savedRole]);
      } else {
        setUser(DEFAULT_USERS['customer']);
      }

      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch {
      setUser(DEFAULT_USERS['customer']);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, targetRole: UserRole = 'customer') => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    const baseUser = DEFAULT_USERS[targetRole];
    const loggedInUser: Profile = {
      ...baseUser,
      email,
    };
    setUser(loggedInUser);
    setRole(targetRole);
    localStorage.setItem('noir_user_role', targetRole);
    localStorage.setItem('noir_user_profile', JSON.stringify(loggedInUser));
    setIsLoading(false);
  };

  const signup = async (email: string, name: string, targetRole: UserRole = 'customer') => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    const newUser: Profile = {
      id: `user-${Date.now()}`,
      email,
      full_name: name,
      role: targetRole,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    setRole(targetRole);
    localStorage.setItem('noir_user_role', targetRole);
    localStorage.setItem('noir_user_profile', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('noir_user_profile');
    localStorage.removeItem('noir_user_role');
  };

  const switchRole = (newRole: UserRole) => {
    const updated = DEFAULT_USERS[newRole];
    setUser(updated);
    setRole(newRole);
    localStorage.setItem('noir_user_role', newRole);
    localStorage.setItem('noir_user_profile', JSON.stringify(updated));
  };

  const addAddress = (addrData: Omit<Address, 'id' | 'user_id'>) => {
    const formattedStreet =
      addrData.street_address ||
      `${addrData.room_number}, ${addrData.block_wing}, ${addrData.floor ? addrData.floor + ', ' : ''}${addrData.building_name}`;

    const newAddr: Address = {
      ...addrData,
      street_address: formattedStreet,
      id: `addr-${Date.now()}`,
      user_id: user?.id || 'guest',
      is_default: addresses.length === 0 || addrData.is_default,
    };

    let updated = [...addresses];
    if (newAddr.is_default) {
      updated = updated.map((a) => ({ ...a, is_default: false }));
    }
    updated.push(newAddr);
    setAddresses(updated);
    localStorage.setItem('noir_user_addresses', JSON.stringify(updated));
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      is_default: a.id === id,
    }));
    setAddresses(updated);
    localStorage.setItem('noir_user_addresses', JSON.stringify(updated));
  };

  const deleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.is_default)) {
      updated[0].is_default = true;
    }
    setAddresses(updated);
    localStorage.setItem('noir_user_addresses', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        addresses,
        isLoading,
        login,
        signup,
        logout,
        switchRole,
        addAddress,
        setDefaultAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
