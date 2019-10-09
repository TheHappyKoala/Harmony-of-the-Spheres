import React, { ReactElement, ReactChild, MouseEvent } from 'react';
import './NavItem.less';

interface NavItemProps {
  children: ReactChild;
  callback?: (event: MouseEvent<HTMLLIElement>) => void;
  active?: boolean;
}

export default ({ children, callback, active }: NavItemProps): ReactElement => (
  <li className={`nav-item ${active ? 'active' : ''}`} onClick={callback}>
    {children}
  </li>
);
