import React, { ChangeEvent } from "react";
import { toggle, toggleTrack } from "./toggle.module.css";

type ToggleProps = {
  checked: boolean;
  label: string;
  callback: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Toggle = ({ checked, label, callback }: ToggleProps) => {
  return (
    <div className={toggle}>
      <input
        type="checkbox"
        id={label}
        checked={checked}
        name={label}
        onChange={callback}
      />
      <label htmlFor={label}>
        <span className={toggleTrack}></span>
      </label>
    </div>
  );
};

export default Toggle;
