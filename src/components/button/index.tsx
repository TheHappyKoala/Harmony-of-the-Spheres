import React, { ReactElement, ReactNode, MouseEvent } from "react";

type Props = {
  callback: (event: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
};

const Button = ({ callback, children }: Props): ReactElement => (
  <div onClick={callback}>{children}</div>
);

export default Button;
