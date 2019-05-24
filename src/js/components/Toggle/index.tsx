import React, { ReactElement, memo } from 'react';
import './Toggle.less';

interface ToggleProps {
  checked: boolean;
  label: string;
  callback: Function;
}

export default memo(
  ({ checked, label, callback }: ToggleProps): ReactElement => (
    <label className="toggle top">
      {label}
      <input type="checkbox" checked={checked} onChange={() => callback()} />
      <span />
    </label>
  ),
  (prevProps, nextProps) => prevProps.checked === nextProps.checked
);
