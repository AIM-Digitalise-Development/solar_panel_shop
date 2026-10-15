"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface QuoteCartItem {
  productId: string;
  name: string;
  slug: string;
  category: string;
  wattage?: number;
  price?: number;
  image?: string;
  quantity: number;
  notes?: string;
}

interface QuoteCartContextType {
  items: QuoteCartItem[];
  addToQuote: (product: {
    _id?: string;
    id?: string;
    name: string;
    slug: string;
    category: string;
    wattage?: number;
    price?: number;
    images?: string[];
  }, quantity?: number, notes?: string) => void;
  removeFromQuote: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearQuote: () => void;
  totalItems: number;
  totalEstimated: number;
}

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(undefined);

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteCartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aethel_quote_cart") || localStorage.getItem("solarshop_quote_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load quote cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("aethel_quote_cart", JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save quote cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

  const addToQuote = (
    product: {
      _id?: string;
      id?: string;
      name: string;
      slug: string;
      category: string;
      wattage?: number;
      price?: number;
      images?: string[];
    },
    quantity: number = 1,
    notes: string = ""
  ) => {
    const id = product._id || product.id || "";
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (notes) updated[existingIndex].notes = notes;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: id,
            name: product.name,
            slug: product.slug,
            category: product.category,
            wattage: product.wattage,
            price: product.price,
            image: product.images?.[0] || "",
            quantity: Math.max(1, quantity),
            notes,
          },
        ];
      }
    });
  };

  const removeFromQuote = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearQuote = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalEstimated = items.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  return (
    <QuoteCartContext.Provider
      value={{
        items,
        addToQuote,
        removeFromQuote,
        updateQuantity,
        clearQuote,
        totalItems,
        totalEstimated,
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);
  if (!context) {
    throw new Error("useQuoteCart must be used within a QuoteCartProvider");
  }
  return context;
}
