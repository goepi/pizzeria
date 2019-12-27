import React from 'react';
interface Props {
  size?: number;
  weight?: number;
  children: string;
}
export const Text = (props: Props) => (
  <span
    style={{
      fontSize: props.size,
      fontWeight: props.weight,
    }}
  >
    {props.children}
  </span>
);

Text.defaultProps = {
  size: 30,
  weight: 400,
};
