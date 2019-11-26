export const validateTokenId = (token: any) =>
  typeof token === 'string' && token.trim().length === 20 ? token : false;

export const validateUsername = (username: any) =>
  typeof username === 'string' && username.length < 30 ? username.trim() : false;

export const validatePassword = (password: any) =>
  typeof password === 'string' && password.length > 0 ? password : false;

export const validateExtend = (extend: any) => typeof extend === 'boolean' && extend === true;

export const validateEmail = (email: any) =>
  typeof email === 'string' && email.length > 0 && validateEmailFormat(email) ? email : false;

const validateEmailFormat = (email: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateAddress = (address: any) => (typeof address === 'string' && address.length > 0 ? address : false);

export const validateMenuId = (menuId: any) => (typeof menuId === 'string' ? menuId.trim() : false);
