import React, { ReactNode, MouseEvent } from "react";

import { button } from "./button.module.css";

type Props = {
  callback?: (event: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
};

const Button = ({ callback, children }: Props) => (
  <div className={button} onClick={callback ? callback : undefined}>
    {children}
  </div>
);

export default Button;
