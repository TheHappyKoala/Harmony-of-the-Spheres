import React from 'react';
import './Button.less';

export default function(props) {
  return (
    <div className="button top" onClick={props.callback}>
      {props.children}
    </div>
  );
}
