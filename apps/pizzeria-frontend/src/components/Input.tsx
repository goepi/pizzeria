import React, { ChangeEventHandler } from 'react';

interface Props {
  value?: string;
  type: string;
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const Input = (props: Props) => (
  <label style={{ marginRight: 10, marginBottom: 10 }}>
    {props.label}
    <input style={{ marginLeft: 5 }} type={props.type} value={props.value} onChange={props.onChange} />
  </label>
);
