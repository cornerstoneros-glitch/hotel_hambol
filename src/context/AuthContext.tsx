'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'CLIENT' | 'ADMIN' | 'STAFF' | null;

interface AuthContextType {
  user: { name: string; role: Role } | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; role: Role } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('hambol_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, role: Role) => {
    const mockUser = { name: email.split('@')[0], role };
    setUser(mockUser);
    localStorage.setItem('hambol_user', JSON.stringify(mockUser));
    
    if (role === 'CLIENT') router.push('/client');
    else router.push('/admin');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hambol_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
