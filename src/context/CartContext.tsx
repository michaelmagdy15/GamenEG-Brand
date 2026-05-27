import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Product } from '../data/products';
import { logTrafficEvent } from '../lib/firestore';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  active: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  coupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discountAmount: number;
  finalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const local = localStorage.getItem('gamen_cart');
      return local ? JSON.parse(local) : [];
    } catch (err) {
      console.warn('Failed to parse cart from localStorage:', err);
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    try {
      const local = localStorage.getItem('gamen_applied_coupon');
      return local ? JSON.parse(local) : null;
    } catch (err) {
      console.warn('Failed to parse applied coupon from localStorage:', err);
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gamen_cart', JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('gamen_applied_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('gamen_applied_coupon');
      }
    } catch (err) {
      console.warn('Failed to save applied coupon to localStorage:', err);
    }
  }, [coupon]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsOpen(true);
    logTrafficEvent(window.location.pathname, `Added ${product.name} to cart`);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const applyCoupon = useCallback((code: string): boolean => {
    let coupons: Coupon[] = [
      { code: 'GAMENCLASSIC', discountType: 'percentage', value: 10, active: true },
      { code: 'ATELIER2026', discountType: 'flat', value: 500, active: true }
    ];
    try {
      const local = localStorage.getItem('gamen_coupons');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          coupons = parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse coupons from localStorage:', err);
    }

    const found = coupons.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (found && found.active) {
      setCoupon(found);
      return true;
    }
    return false;
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    try {
      localStorage.removeItem('gamen_applied_coupon');
    } catch (err) {
      console.warn('Failed to remove applied coupon from localStorage:', err);
    }
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const discountAmount = coupon
    ? coupon.discountType === 'percentage'
      ? Math.round(totalPrice * (coupon.value / 100))
      : Math.min(totalPrice, coupon.value)
    : 0;

  const finalPrice = Math.max(0, totalPrice - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
        coupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        finalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
