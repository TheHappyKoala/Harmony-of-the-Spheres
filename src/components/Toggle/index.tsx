import React, { ReactElement } from "react";
import "./Toggle.less";

interface ToggleProps {
  checked: boolean;
  label: string;
  callback: Function;
}

export default ({ checked, label, callback }: ToggleProps): ReactElement => (
  <label className="toggle">
    {label}
    <input type="checkbox" checked={checked} onChange={() => callback()} />
    <span />
  </label>
);
