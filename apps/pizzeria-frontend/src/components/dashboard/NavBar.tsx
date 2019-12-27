import React from 'react';
import { CartContext, itemsInCart } from '../../context/cart';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'antd';
import { Text } from '../Text';

interface NavLinkProps {
  text: string;
  to: string;
}

const NavLink = (props: NavLinkProps) => (
  <Link to={props.to} style={{ marginRight: 40 }}>
    <Text size={40} weight={600}>
      {props.text}
    </Text>
  </Link>
);

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
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <NavLink to="/menu" text="Menu" />
          <NavLink to="/orders" text="Orders" />
        </div>
        <Icon style={{ fontSize: 40 }} type="shopping-cart" />
        <Text size={40} weight={800}>{`${itemsInCart(value.cart)}`}</Text>
        <Link to={'/checkout'} style={{ marginLeft: 20 }}>
          <Button type="primary">Check out</Button>
        </Link>
      </div>
    )}
  </CartContext.Consumer>
);
