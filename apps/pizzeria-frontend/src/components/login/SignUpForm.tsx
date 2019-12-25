import React from 'react';
import { Input } from '../Input';
import { Button } from '../Button';

interface Props {
  username?: string;
  password?: string;
  address?: string;
  email?: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setEmail: (email: string) => void;
  setAddress: (address: string) => void;
  onSubmit: () => void;
}

export const SignUpForm = (props: Props) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Input type="text" label="Username" value={props.username} onChange={e => props.setUsername(e.target.value)} />
    <Input type="password" label="Password" value={props.password} onChange={e => props.setPassword(e.target.value)} />
    <Input type="text" label="Email" value={props.email} onChange={e => props.setEmail(e.target.value)} />
    <Input type="text" label="Address" value={props.address} onChange={e => props.setAddress(e.target.value)} />
    <Button label="Sign up" onClick={props.onSubmit} />
  </div>
);
