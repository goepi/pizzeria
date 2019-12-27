import React from 'react';
import { getOrders } from '../api';
import { Cart } from '../context/cart';
import { Products } from './dashboard/Dashboard';

export interface Order {
  id: string;
  username: string;
  cart: Cart;
  price: number;
  paid: boolean;
}

interface State {
  orders: Order[];
  error: string | null;
}

interface Props {
  products: Products;
}

interface OrderItemProps {
  order: Order;
  products: Products;
}

const OrderItem = (props: OrderItemProps) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
      <div style={{ flex: 3 }}>{props.order.id}</div>
      <div style={{ flex: 1 }}>{`$${props.order.price}`}</div>
    </div>
    <ul>
      {Object.keys(props.order.cart).map(key => (
        <li key={key}>
          {props.products[key] && props.products[key].name} {props.order.cart[key]}
        </li>
      ))}
    </ul>
  </div>
);

export class Orders extends React.Component<Props, State> {
  public state: State = { orders: [], error: null };

  public componentDidMount() {
    this.getOrders();
  }

  public getOrders = () => {
    getOrders()
      .then(orders => {
        this.setState({ orders });
      })
      .catch(e => this.setState({ error: e.message }));
  };

  public render() {
    return (
      <>
        {this.state.orders.map(o => (
          <OrderItem key={o.id} order={o} products={this.props.products} />
        ))}
      </>
    );
  }
}
