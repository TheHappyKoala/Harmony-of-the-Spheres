import React from 'react';
import './SideBar.less';

export default function(props) {
  return (
    <nav className="side-bar-wrapper">
      <ul>
        <li>
          <i className="fas fa-cube fa-2x" />
          <p>Physics</p>
        </li>
        <li>
          <i className="fas fa-paint-brush fa-2x" />
          <p>Graphics</p>
        </li>
        <li>
          <i className="fas fa-camera-retro fa-2x" />
          <p>Camera</p>
        </li>
        <li>
          <i className="fas fa-pencil fa-2x" />
          <p>Modify Masses</p>
        </li>
        <li>
          <i className="fas fa-plus fa-2x" />
          <p>Add Mass</p>
        </li>
      </ul>
    </nav>
  );
}
