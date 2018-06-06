import React from 'react';
import './Toggle.less';

export default function(props) {
  return (
    <label className="toggle top">
      {props.label}
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.callback}
      />
      <span />
    </label>
  );
}
