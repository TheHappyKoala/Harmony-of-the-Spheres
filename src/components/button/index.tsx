import React, { ReactNode, MouseEvent } from "react";

import { button } from "./button.module.css";

type Props = {
  callback?: (event: MouseEvent<HTMLDivElement>) => void;
  cssModifier?: string;
  children: ReactNode;
};

const Button = ({ callback, children, cssModifier }: Props) => (
  <div
    className={`${button} ${cssModifier ? cssModifier : ""}`}
    onClick={callback ? callback : undefined}
  >
    {children}
  </div>
);

export default Button;
