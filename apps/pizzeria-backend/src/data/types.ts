import { Cart } from '../handlers/carts';

export interface User {
  username: string;
  hashedPassword: string;
  email: string;
  address: string;
  cart: Cart;
}

export interface Token {
  id: string;
  username: string;
  expires: number;
}

export interface MenuItem {
  name: string;
  price: number;
}

export interface Menu {
  [menuItemId: string]: MenuItem;
}
