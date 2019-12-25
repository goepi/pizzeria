import React from 'react';
import { Products } from './Dashboard';

interface Props {
  products: Products;
  addProductToCart: (id: string) => void;
}

export const Menu = (props: Props) => (
  <ul>
    {Object.keys(props.products).map(id => (
      <a key={id} onClick={() => props.addProductToCart(id)}>
        <li>
          {props.products[id].name} {props.products[id].price}
        </li>
      </a>
    ))}
  </ul>
);
