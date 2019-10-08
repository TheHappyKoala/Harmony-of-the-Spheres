import React, { ReactElement } from 'react';
import { getPaginationRange } from '../../utils';
import './Pagination.less';

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
      <li
        key="pagination-first-page"
        onClick={() =>
          setPagination({
            ...pagination,
            start: 0 * itemsPerPage,
            end: 1 * itemsPerPage,
            page: 1
          })
        }
      >
        First Page
      </li>
    ];

    for (let i = range.start; i <= range.end; i++) {
      items.push(
        <li
          key={i}
          onClick={() =>
            setPagination({
              ...pagination,
              start: (i - 1) * itemsPerPage,
              end: i * itemsPerPage,
              page: i
            })
          }
          className={`${i === pagination.page ? 'active' : ''}`}
        >
          {i}
        </li>
      );
    }

    return [
      ...items,
      <li
        key="pagination-last-page"
        onClick={() =>
          setPagination({
            ...pagination,
            start: (pagination.count - 1) * itemsPerPage,
            end: pagination.count * itemsPerPage,
            page: pagination.count
          })
        }
      >
        Last Page
      </li>
    ];
  };

  return (
    <ul className="pagination">
      {renderRange(
        getPaginationRange(pagination.page, pagination.count),
        itemsPerPage
      )}
    </ul>
  );
};
