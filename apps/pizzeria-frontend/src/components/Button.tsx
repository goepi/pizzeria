import React from 'react';

interface Props {
  label: string;
  onClick: () => void;
}

export const Button = (props: Props) => (
  <button style={{ width: 100, height: 25 }} onClick={props.onClick}>
    {props.label}
  </button>
);
