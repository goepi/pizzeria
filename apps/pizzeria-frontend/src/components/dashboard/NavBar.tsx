import React from 'react';
import { CartContext, itemsInCart } from '../../context/cart';

export const NavBar = () => (
  <CartContext.Consumer>
    {value => (
      <div
        style={{
          width: '100%',
          height: 75,
          backgroundColor: 'black',
          color: 'white',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800 }}>{`Cart: ${itemsInCart(value.cart)}`}</div>
      </div>
    )}
  </CartContext.Consumer>
);
