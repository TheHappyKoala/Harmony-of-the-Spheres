import React from 'react';
import './Slider.less';

export default function(props) {
  return (
    <div>
      <div className="slider-value">{props.val}</div>
      <input
        className="slider"
        type="range"
        max={props.max}
        min={props.min}
        step={props.step}
        onInput={props.callback}
        value={props.val}
      />
    </div>
  );
}
