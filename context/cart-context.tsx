'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ExtendedCourse } from '@/data/mockData';
import { useToast } from "@/components/ui/use-toast";

interface CartItem extends ExtendedCourse {
  quantity: number;
  addedAt: string;
  selected: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (course: ExtendedCourse) => void;
  removeFromCart: (courseId: string | number) => void;
  clearCart: () => void;
  totalPrice: number;
  discountedTotal: number;
  cartCount: number;
  isInCart: (courseId: string | number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Hydrate from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('skillfinite-cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('skillfinite-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (course: ExtendedCourse) => {
    const alreadyInCart = cartItems.some(item => item.id === course.id);

    if (alreadyInCart) {
      toast({
        title: "Already in cart",
        description: `${course.title} is already in your cart.`,
        variant: "default",
      });
      return;
    }

    setCartItems(prev => [...prev, {
      ...course,
      quantity: 1,
      addedAt: new Date().toISOString(),
      selected: true
    }]);

    toast({
      title: "Added to cart",
      description: `${course.title} has been added to your cart.`,
      variant: "default",
    });
  };

  const removeFromCart = (courseId: string | number) => {
    setCartItems(prev => prev.filter(item => item.id !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    if (item.price === 'Free') return acc;
    return acc + (parseInt(item.price.replace(/[^0-9]/g, '')) || 0);
  }, 0);

  // Mock discount logic (e.g. original price is higher)
  const discountedTotal = cartItems.reduce((acc, item) => {
    if (item.price === 'Free') return acc;
    // Mock: Original price is 5x current price (approx 80% off) as shown in CourseDetailPage
    const currentPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    return acc + (currentPrice * 5); // Original Price
  }, 0);

  const cartCount = cartItems.length;

  const isInCart = (courseId: string | number) => {
    return cartItems.some(item => item.id === courseId);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice, discountedTotal, cartCount, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
