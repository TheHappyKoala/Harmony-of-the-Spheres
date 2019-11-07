import React, { ReactElement, Fragment, useState } from "react";
import { Link } from "gatsby";

interface NavigationProps {
  scenariosInCategory: { node: { name: string } }[];
}

export default ({ scenariosInCategory }: NavigationProps): ReactElement => {
  return (
    <div className="filter-bar">
      {scenariosInCategory.map(({ node }) => (
        <Link to={`/${node.name}`}>
          <div>{node.name}</div>
        </Link>
      ))}
    </div>
  );
};
