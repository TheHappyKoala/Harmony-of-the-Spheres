import React, { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props): ReactElement => {
  return (
    <div>
      <header>
        <div>
          <h1>Gravity Simulator</h1>
        </div>
        <nav></nav>
      </header>
      {children}
      <footer></footer>
    </div>
  );
};

export default Layout;
