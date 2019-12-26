import React from 'react';
import { Product, Products } from './Dashboard';

interface Props {
  products: Products;
  addProductToCart: (id: string) => void;
}

interface MenuItemProps {
  name: string;
  price: number;
  addProductToCart: () => void;
}

const MenuItem = (props: MenuItemProps) => (
  <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
    <div style={{ flex: 3 }}>{props.name}</div>
    <div style={{ flex: 1 }}>{props.price}</div>
    <div style={{ flex: 0.5 }} onClick={props.addProductToCart}>
      Add
    </div>
  </div>
);

export const Menu = (props: Props) => (
  <div style={{ width: '30%', marginLeft: 20, marginTop: 20 }}>
    {Object.keys(props.products).map(id => (
      <MenuItem
        key={id}
        name={props.products[id].name}
        price={props.products[id].price}
        addProductToCart={() => props.addProductToCart(id)}
      />
    ))}
  </div>
);
