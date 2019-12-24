import React from 'react';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';

const NavigationBarInner = () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
    </ul>
  </nav>
);

export const NavigationBar = withCookies(NavigationBarInner);
