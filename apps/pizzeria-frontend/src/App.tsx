import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Login } from './components/login/Login';
import { addProductToCart, getCart, getMenu } from './api';
import { Auth } from './authentication';
import { Menu } from './components/dashboard/Menu';
import { Cart, CartContext } from './context/cart';
import { Dashboard } from './components/dashboard/Dashboard';

interface State {
  cart: Cart;
}

export class App extends React.Component<any, State> {
  public constructor(props: any) {
    super(props);
    this.state = {
      cart: {},
    };
  }

  public addProductToCart = async (id: string) => {
    const newCart = { ...this.state.cart };
    if (newCart[id]) {
      newCart[id] += 1;
    } else {
      newCart[id] = 1;
    }
    const username = Auth.getUsername();
    if (username) {
      const result = await addProductToCart(username, { [id]: 1 });
      if (result) {
        this.setState({ cart: newCart });
      }
    }
  };

  public initializeCart = async () => {
    const cart = await getCart();
    if (cart) {
      this.setState({ cart });
    }
  };

  public render() {
    return (
      <Router>
        <Route path="/login" component={Login} />
        <CartContext.Provider
          value={{
            cart: this.state.cart,
            addProductToCart: this.addProductToCart,
            initializeCart: this.initializeCart,
          }}
        >
          <Route path="/" render={() => (Auth.isAuthenticated() ? <Dashboard /> : <Redirect to="/login" />)} />
        </CartContext.Provider>
      </Router>
    );
  }
}
