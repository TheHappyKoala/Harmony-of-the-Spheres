import React, { ReactElement, Fragment, useState } from "react";

interface NavigationProps {
  scenariosInCategory: { node: { name: string } }[];
}

export default ({ scenariosInCategory }: NavigationProps): ReactElement => {
  return (
    <div className="filter-bar">
      {scenariosInCategory.map(({ node }) => (
        <div>{node.name}</div>
      ))}
    </div>
  );
};
