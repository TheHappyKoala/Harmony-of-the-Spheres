import React, { ReactElement } from "react";

type ToggleProps = {
  checked: boolean;
  label: string;
  callback: Function;
};

const Toggle = ({ checked, label, callback }: ToggleProps): ReactElement => {
  return (
    <div className="toggle">
      <input
        type="checkbox"
        id={label}
        checked={checked}
        name={label}
        onChange={() => callback()}
      />
      <label htmlFor={label}>
        <span className="toggle-track"></span>
      </label>
    </div>
  );
};

export default Toggle;
