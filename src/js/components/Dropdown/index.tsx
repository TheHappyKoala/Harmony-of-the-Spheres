import React, {
  ReactNode,
  memo,
  ReactElement,
  Fragment,
  useState,
  useRef,
  Children,
  useEffect
} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Dropdown.less';

interface DropdownProps {
  children: ReactNode;
  selectedOption: string;
  tabs?: {
    cssClass: string;
    activeCssClass: string;
    optionsCssClass: string;
    identifier: string;
    selectedCategory: string;
    pagination: {
      itemsPerPage: number;
      paginationListCssClass: string;
    };
  };
  transition: {
    name?: string;
    enterTimeout: number | boolean;
    leaveTimeout: number | boolean;
  };
  dropdownWrapperCssClassName: string;
  selectedOptionCssClassName: string;
  optionsWrapperCssClass: string;
  dynamicChildrenLen: number;
}

export default memo(
  ({
    children,
    selectedOption,
    tabs,
    dropdownWrapperCssClassName,
    optionsWrapperCssClass,
    selectedOptionCssClassName,
    transition,
    dynamicChildrenLen
  }: DropdownProps): ReactElement => {
    const [options, setOptions] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>(
      tabs && tabs.selectedCategory
    );
    const [pagination, setPagination] = useState<{
      count: number;
      start: number;
      end: number;
      page: number;
    }>({
      count: 0,
      start: 0,
      end: 0,
      page: 1
    });

    const tabsLabels: string[] = [];

    let childrenToRender;

    const getRange = (page: number, count: number) => {
      let start;
      let end;

      if (count <= 10) {
        start = 1;
        end = count;
      } else {
        if (page <= 6) {
          start = 1;
          end = 10;
        } else if (page + 4 >= count) {
          start = count - 9;
          end = count;
        } else {
          start = page - 5;
          end = page + 4;
        }
      }

      return { start, end };
    };

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

      for (let i = range.start; i <= range.end; i++)
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
            className={pagination.page === i ? tabs.activeCssClass : ''}
          >
            {i}
          </li>
        );

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

    if (tabs) {
      Children.toArray(children).forEach(
        (entry: ReactElement) =>
          tabsLabels.indexOf(entry.props['data-identifier']) === -1 &&
          tabsLabels.push(entry.props['data-identifier'])
      );

      childrenToRender = Children.map(
        children,
        (option: ReactElement): ReactElement => {
          if (option.props['data-identifier'] === selectedTab) return option;
          else return null;
        }
      );

      useEffect(
        () => {
          setPagination({
            count: Math.ceil(
              childrenToRender.length / tabs.pagination.itemsPerPage
            ),
            start: 0 * tabs.pagination.itemsPerPage,
            end: 1 * tabs.pagination.itemsPerPage,
            page: 1
          });
        },
        [selectedTab]
      );
    }

    const optionsWrapper = useRef(null);
    const optionsWithTabs = useRef(null);
    const dropdownNavigation = useRef(null);

    const handleOpenOptions = () => {
      if (options) return;

      setOptions(true);
      document.addEventListener('click', handleClickWhenOptionsAreOpen);
    };

    const handleClickWhenOptionsAreOpen = (e: MouseEvent) => {
      if (
        (tabs !== undefined && dropdownNavigation.current.contains(e.target)) ||
        e.target === optionsWrapper.current ||
        e.target === optionsWithTabs.current
      )
        return;

      setOptions(false);

      document.removeEventListener('click', handleClickWhenOptionsAreOpen);
    };

    return (
      <div className={dropdownWrapperCssClassName}>
        <div onClick={handleOpenOptions} className={selectedOptionCssClassName}>
          {selectedOption}
          <i
            className={'fa fa-chevron-circle-down fa-2x'}
            style={{ transform: `rotate(${options ? '-180' : '0'}deg)` }}
          />
        </div>
        <ReactCSSTransitionGroup
          transitionName={transition.name}
          transitionEnterTimeout={transition.enterTimeout}
          transitionLeaveTimeout={transition.leaveTimeout}
        >
          {options && (
            <div ref={optionsWrapper} className={optionsWrapperCssClass}>
              {tabs && (
                <Fragment>
                  <nav ref={dropdownNavigation}>
                    <ul className={tabs.cssClass}>
                      {tabsLabels.map(tabLabel => (
                        <li
                          key={tabLabel}
                          onClick={() => setSelectedTab(tabLabel)}
                          className={
                            selectedTab === tabLabel ? tabs.activeCssClass : ''
                          }
                        >
                          {tabLabel}
                        </li>
                      ))}
                    </ul>
                    {pagination.count > 1 && (
                      <ul className={tabs.pagination.paginationListCssClass}>
                        {renderRange(
                          getRange(pagination.page, pagination.count),
                          tabs.pagination.itemsPerPage
                        )}
                      </ul>
                    )}
                  </nav>
                  <div className={tabs.optionsCssClass} ref={optionsWithTabs}>
                    {childrenToRender.slice(pagination.start, pagination.end)}
                  </div>
                </Fragment>
              )}
              {!tabs && children}
            </div>
          )}
        </ReactCSSTransitionGroup>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selectedOption === nextProps.selectedOption &&
    prevProps.dynamicChildrenLen === nextProps.dynamicChildrenLen
);
