import React from 'react';
import { checkout } from '../api';
import { Cart } from '../context/cart';
import { Products } from './dashboard/Dashboard';
import { Button } from 'antd';
import { Text } from './Text';

interface State {
  successfulPayment: boolean;
  error: string | null;
}

interface Props {
  cart: Cart;
  products: Products;
  resetCart: () => void;
}

interface CartItemProps {
  name: string;
  quantity: number;
  price: number;
}

const CartItem = (props: CartItemProps) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
      <div style={{ flex: 3 }}>{props.name}</div>
      <div style={{ flex: 3 }}>{props.quantity}</div>
      <div style={{ flex: 1 }}>{`$${props.price}`}</div>
    </div>
  </div>
);

export class Checkout extends React.Component<Props, State> {
  public state: State = {
    error: null,
    successfulPayment: false,
  };
  private makePayment = () => {
    checkout()
      .then(() => {
        this.props.resetCart();
        this.setState({ successfulPayment: true });
      })
      .catch(e => this.setState({ error: e.message }));
  };

  private getTotal = () => {
    return Math.floor(
      Object.keys(this.props.cart).reduce(
        (acc, productId) => acc + this.props.cart[productId] * this.props.products[productId].price,
        0
      )
    );
  };

  public render() {
    if (this.state.error) {
      return <Text>{this.state.error}</Text>;
    }
    if (this.state.successfulPayment) {
      return <Text>Your payment was successful.</Text>;
    }
    return (
      <div style={{ margin: 20 }}>
        {Object.keys(this.props.cart).map(productId => (
          <CartItem
            key={productId}
            name={this.props.products[productId].name}
            quantity={this.props.cart[productId]}
            price={this.props.products[productId].price}
          />
        ))}
        <div style={{ margin: 20 }}>
          <Text>{`Your total is $${this.getTotal()}`}</Text>
        </div>
        <Button onClick={this.makePayment}>Confirm payment</Button>
      </div>
    );
  }
}
