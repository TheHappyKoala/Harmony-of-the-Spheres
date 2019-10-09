import React, { ReactElement } from 'react';
import Nav from '../Nav';
import NavItem from '../NavItem';
import { getPaginationRange } from '../../utils';

interface PaginationProps {
  itemsPerPage: number;
  pagination: {
    count: number;
    start: number;
    end: number;
    page: number;
  };
  setPagination: any;
}

export default ({
  itemsPerPage,
  pagination,
  setPagination
}: PaginationProps): ReactElement => {
  const renderRange = (
    range: { start: number; end: number },
    itemsPerPage: number
  ) => {
    const items = [
      <NavItem
        key="pagination-first-page"
        callback={() =>
          setPagination({
            ...pagination,
            start: 0 * itemsPerPage,
            end: 1 * itemsPerPage,
            page: 1
          })
        }
      >
        First Page
      </NavItem>
    ];

    for (let i = range.start; i <= range.end; i++) {
      items.push(
        <NavItem
          key={i}
          callback={() =>
            setPagination({
              ...pagination,
              start: (i - 1) * itemsPerPage,
              end: i * itemsPerPage,
              page: i
            })
          }
          active={i === pagination.page}
        >
          {i}
        </NavItem>
      );
    }

    return [
      ...items,
      <NavItem
        key="pagination-last-page"
        callback={() =>
          setPagination({
            ...pagination,
            start: (pagination.count - 1) * itemsPerPage,
            end: pagination.count * itemsPerPage,
            page: pagination.count
          })
        }
      >
        Last Page
      </NavItem>
    ];
  };

  return (
    <Nav>
      {renderRange(
        getPaginationRange(pagination.page, pagination.count),
        itemsPerPage
      )}
    </Nav>
  );
};
