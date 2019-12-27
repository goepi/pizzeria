import { Cart } from '../context/cart';
import { Auth } from '../authentication';

export const login = async (username: string, password: string) => {
  const response = await fetch('https://localhost:5001/tokens', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    return await response.json();
  }
  return false;
};

export const logout = async (token: string) => {
  const response = await fetch('https://localhost:5001/tokens', {
    method: 'DELETE',
    body: JSON.stringify({ id: token }),
  });

  if (response.ok) {
    return await response.json();
  }
  return false;
};

export const signUp = async (username: string, password: string, email: string, address: string) => {
  const response = await fetch('https://localhost:5001/users', {
    method: 'POST',
    body: JSON.stringify({ username, password, email, address }),
  });

  if (response.ok) {
    return await response.json();
  }
  return false;
};

export const getMenu = async () => {
  const response = await fetch('https://localhost:5001/menus?menuId=springMenu');
  if (response.ok) {
    return await response.json();
  }
  return false;
};

export const getCart = async () => {
  if (Auth.isAuthenticated()) {
    const token = Auth.getAuthToken();
    const username = Auth.getUsername();
    if (token && username) {
      if (token) {
        const response = await fetch(`https://localhost:5001/users/${username}/cart`, {
          headers: {
            token,
          },
        });
        if (response.ok) {
          return await response.json();
        }
      }
    }
  }
  return false;
};

export const addProductToCart = async (username: string, cart: Cart) => {
  if (Auth.isAuthenticated()) {
    const token = Auth.getAuthToken();
    if (token) {
      const response = await fetch(`https://localhost:5001/users/${username}/cart`, {
        method: 'PUT',
        headers: {
          token,
        },
        body: JSON.stringify({ cart }),
      });
      if (response.ok) {
        return await response.json();
      }
    }
  }
  return false;
};
