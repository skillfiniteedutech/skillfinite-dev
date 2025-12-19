import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../hooks/use-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (course) => {
    const exists = cartItems.find(item => item.id === course.id);
    if (exists) {
      toast({
        title: 'Already in cart',
        description: `${course.title} is already in your cart`,
      });
      return;
    }

    // For free courses, automatically add to cart with quantity 1
    const cartItem = {
      course: course,
      quantity: 1,
      addedAt: new Date().toISOString()
    };

    setCartItems([...cartItems, cartItem]);

    const isFree = course.free || course.price === 0;
    toast({
      title: isFree ? 'Free course added!' : 'Added to cart',
      description: isFree
        ? `${course.title} has been added to your cart. It's free!`
        : `${course.title} has been added to your cart`,
    });
  };

  const removeFromCart = (courseId) => {
    setCartItems(cartItems.filter(item => item.course.id !== courseId));
    toast({
      title: 'Removed from cart',
      description: 'Item has been removed from your cart',
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart',
    });
  };

  const addToWishlist = (course) => {
    const exists = wishlist.find(item => item.id === course.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== course.id));
      toast({
        title: 'Removed from wishlist',
        description: `${course.title} has been removed from your wishlist`,
      });
    } else {
      setWishlist([...wishlist, course]);
      toast({
        title: 'Added to wishlist',
        description: `${course.title} has been added to your wishlist`,
      });
    }
  };

  const isInWishlist = (courseId) => {
    return wishlist.some(item => item.id === courseId);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const isFree = item.course.free || item.course.price === 0;
      return total + (isFree ? 0 : item.course.price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      wishlist,
      addToCart,
      removeFromCart,
      clearCart,
      addToWishlist,
      isInWishlist,
      getCartTotal,
      cartCount: cartItems.length,
      wishlistCount: wishlist.length
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};