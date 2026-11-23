'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole, Address } from '@/types/database';

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  addresses: Address[];
  isLoading: boolean;
  login: (email: string, role?: UserRole, name?: string) => Promise<void>;
  signup: (email: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  addAddress: (address: Omit<Address, 'id' | 'user_id'>) => void;
  setDefaultAddress: (id: string) => void;
  deleteAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');
  const [user, setUser] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('millet_user_role') as UserRole;
      const savedUser = localStorage.getItem('millet_user_profile');
      const savedAddresses = localStorage.getItem('millet_user_addresses');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
        if (savedRole) setRole(savedRole);
      } else {
        setUser(null);
      }

      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, targetRole: UserRole = 'customer', name?: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 200));
    
    // Format display name from input or email username
    const displayName =
      name?.trim() ||
      email
        .split('@')[0]
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const loggedInUser: Profile = {
      id: `user-${Date.now()}`,
      email,
      full_name: displayName,
      role: targetRole,
      created_at: new Date().toISOString(),
    };

    setUser(loggedInUser);
    setRole(targetRole);
    localStorage.setItem('millet_user_role', targetRole);
    localStorage.setItem('millet_user_profile', JSON.stringify(loggedInUser));
    setIsLoading(false);
  };

  const signup = async (email: string, name: string, targetRole: UserRole = 'customer') => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 200));
    const newUser: Profile = {
      id: `user-${Date.now()}`,
      email,
      full_name: name,
      role: targetRole,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    setRole(targetRole);
    localStorage.setItem('millet_user_role', targetRole);
    localStorage.setItem('millet_user_profile', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('millet_user_profile');
    localStorage.removeItem('millet_user_role');
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('millet_user_role', newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('millet_user_profile', JSON.stringify(updated));
    }
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
    localStorage.setItem('millet_user_addresses', JSON.stringify(updated));
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      is_default: a.id === id,
    }));
    setAddresses(updated);
    localStorage.setItem('millet_user_addresses', JSON.stringify(updated));
  };

  const deleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.is_default)) {
      updated[0].is_default = true;
    }
    setAddresses(updated);
    localStorage.setItem('millet_user_addresses', JSON.stringify(updated));
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
