import React from 'react';
import { getMenu } from '../../api';
import { CartContext } from '../../context/cart';
import { Menu } from './Menu';
import { NavBar } from './NavBar';

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

export class Dashboard extends React.Component<any, any> {
  public static contextType: React.Context<CartContext> = CartContext;
  public state: State = { products: {}, error: null };

  public componentDidMount() {
    this.getMenu();
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
        <Menu products={this.state.products} addProductToCart={this.context.addProductToCart} />
      </>
    );
  }
}
