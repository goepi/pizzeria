import { Cart } from '../handlers/carts';

export interface User {
  username: string;
  hashedPassword: string;
  email: string;
  address: string;
  cart: Cart;
  orders: string[];
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

export interface Order {
  id: string;
  username: string;
  cart: Cart;
  price: number;
  paid: boolean;
}

export interface UserOrders {
  orderIds: string[];
  username: string;
}
