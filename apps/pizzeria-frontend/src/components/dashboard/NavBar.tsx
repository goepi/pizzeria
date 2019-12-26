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
        }}
      >{`Cart: ${itemsInCart(value.cart)}`}</div>
    )}
  </CartContext.Consumer>
);
