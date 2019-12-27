import React from 'react';
import { getMenu } from '../../api';
import { Route } from 'react-router-dom';
import { CartContext } from '../../context/cart';
import { Menu } from './Menu';
import { NavBar } from './NavBar';
import { Orders } from '../Orders';
import { Checkout } from '../Checkout';

export interface Product {
  name: string;
  price: number;
}

export interface Products {
  [product: string]: Product;
}

interface State {
  products: Products;
  error: string | null;
}

export class Dashboard extends React.Component<{}, State> {
  public static contextType: React.Context<CartContext> = CartContext;
  public state: State = { products: {}, error: null };

  public componentDidMount() {
    this.getMenu();
    this.context.initializeCart();
  }

  public getMenu = () => {
    getMenu()
      .then(menu => {
        this.setState({ products: menu });
      })
      .catch(e => this.setState({ error: 'Failed to fetch menu.' }));
  };

  public render() {
    return (
      <>
        <NavBar />
        <Route
          path={'/menu'}
          render={() => <Menu products={this.state.products} addProductToCart={this.context.addProductToCart} />}
        />
        <Route path={'/orders'} render={() => <Orders products={this.state.products} />} />
        <Route
          path={'/checkout'}
          render={() => (
            <Checkout products={this.state.products} cart={this.context.cart} resetCart={this.context.resetCart} />
          )}
        />
      </>
    );
  }
}
