import React, { ReactElement } from "react";
import { Link } from "gatsby";
import Nav from "../Nav";
import NavItem from "../NavItem";
import { getPaginationRange } from "../../utils";

interface PaginationProps {
  itemsPerPage: number;
  pagination: {
    count: number;
    start: number;
    end: number;
    page: number;
    path: string;
  };
}

export default ({ pagination }: PaginationProps): ReactElement => {
  const renderRange = (range: { start: number; end: number }) => {
    const items = [
      <Link to={pagination.path}>
        <NavItem key="pagination-first-page">First Page</NavItem>
      </Link>
    ];

    for (let i = range.start; i <= range.end; i++) {
      items.push(
        <Link to={i !== 1 ? `${pagination.path}/${i}` : pagination.path}>
          <NavItem key={i} active={i === pagination.page}>
            {i}
          </NavItem>
        </Link>
      );
    }

    return [
      ...items,
      <Link to={`${pagination.path}/${pagination.count}`}>
        <NavItem key="pagination-last-page">Last Page</NavItem>
      </Link>
    ];
  };

  return (
    <Nav css={{ border: "none", borderBottom: "1px solid #545454" }}>
      {renderRange(getPaginationRange(pagination.page, pagination.count))}
    </Nav>
  );
};
