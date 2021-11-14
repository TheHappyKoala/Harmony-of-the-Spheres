import React, { ReactElement } from "react";
import "./Toggle.less";

interface ToggleProps {
  checked: boolean;
  label: string;
  callback: Function;
}

export default ({ checked, label, callback }: ToggleProps): ReactElement => (
  <div className="toggle-wrapper">
    <span>{label}</span>
    <div className="toggle-switch">
      <input
        type="checkbox"
        name={label}
        id={label}
        checked={checked}
        onChange={() => callback()}
      />
      <label htmlFor={label}>
        <span className="toggle-track"></span>
      </label>
    </div>
  </div>
);
