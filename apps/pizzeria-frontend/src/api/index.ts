export const login = async (username: string, password: string) => {
  const response = await fetch('https://localhost:5001/tokens', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    return await response.json();
  }
};

export const logout = async (token: string) => {
  const response = await fetch('https://localhost:5001/tokens', {
    method: 'DELETE',
    body: JSON.stringify({ id: token }),
  });

  if (response.ok) {
    return await response.json();
  }
};

export const signUp = async (username: string, password: string, email: string, address: string) => {
  const response = await fetch('https://localhost:5001/users', {
    method: 'POST',
    body: JSON.stringify({ username, password, email, address }),
  });

  if (response.ok) {
    return await response.json();
  }
};

export const getMenu = async () => {
  const response = await fetch('https://localhost:5001/menus?menuId=springMenu');
  if (response.ok) {
    return await response.json();
  }
};
