export interface User {
  username: string;
  hashedPassword: string;
  email: string;
  address: string;
}

export interface Token {
  id: string;
  username: string;
  expires: number;
}
