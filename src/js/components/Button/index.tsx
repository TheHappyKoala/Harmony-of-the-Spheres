import React, {
  ReactElement,
  ReactChildren,
  ReactChild,
  MouseEvent
} from 'react';
import './Button.less';

interface ButtonProps {
  callback: (event: MouseEvent<HTMLDivElement>) => void;
  children: ReactChildren | ReactChild;
  cssClassName: string;
}

export default ({
  callback,
  children,
  cssClassName
}: ButtonProps): ReactElement => {
  return (
    <div className={cssClassName} onClick={callback}>
      {children}
    </div>
  );
};
