import React from 'react';
import { Input } from '../Input';
import { Button } from 'antd';

interface Props {
  username?: string;
  password?: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  onSubmit: () => void;
}

export const SignInForm = (props: Props) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Input value={props.username} type={'text'} label="Username" onChange={e => props.setUsername(e.target.value)} />
    <Input
      value={props.password}
      type={'password'}
      label="Password"
      onChange={e => props.setPassword(e.target.value)}
    />
    <Button onClick={props.onSubmit}>Sign in</Button>
  </div>
);
