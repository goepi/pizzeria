import React from 'react';

export interface Cart {
  [id: string]: number;
}

export interface CartContext {
  cart: Cart;
  addProductToCart?: (id: string) => void;
  initializeCart?: () => void;
}

export const CartContext = React.createContext<CartContext>({ cart: {} });

export const itemsInCart = (cart: Cart) => Object.keys(cart).reduce((acc, id) => (acc += cart[id]), 0);
