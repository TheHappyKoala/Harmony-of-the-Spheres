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
import Nav from '../Nav';
import NavItem from '../NavItem';
import Pagination from '../Pagination';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './FilterBar.less';

interface DropdownProps {
  children: ReactNode;
  selectedOption: string;
  itemsPerPage: number;
  selectedCategory: string;
  dynamicChildrenLen: number;
  wrapperCssClassName: string;
  selectedCssClassName: string;
  resultsCssClass: string;
  transition: {
    name?: string;
    enterTimeout: number | boolean;
    leaveTimeout: number | boolean;
  };
}

export default memo(
  ({
    children,
    selectedOption,
    itemsPerPage,
    selectedCategory,
    dynamicChildrenLen,
    wrapperCssClassName,
    selectedCssClassName,
    resultsCssClass,
    transition
  }: DropdownProps): ReactElement => {
    const [options, setOptions] = useState<boolean>(true);
    const [selectedTab, setSelectedTab] = useState(selectedCategory);
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

    Children.toArray(children).forEach(
      (entry: ReactElement) =>
        !tabsLabels.includes(entry.props['data-identifier']) &&
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
          count: Math.ceil(childrenToRender.length / itemsPerPage),
          start: 0 * itemsPerPage,
          end: 1 * itemsPerPage,
          page: 1
        });
      },
      [selectedTab]
    );

    const optionsWithTabs = useRef(null);

    return (
      <div className={wrapperCssClassName}>
        <div
          onClick={() => setOptions(!options)}
          className={selectedCssClassName}
        >
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
            <div>
              <Fragment>
                <Nav css={{ borderBottom: 'none' }}>
                  {tabsLabels.map(tabLabel => (
                    <NavItem
                      key={tabLabel}
                      callback={() => setSelectedTab(tabLabel)}
                      active={selectedTab === tabLabel}
                    >
                      {tabLabel}
                    </NavItem>
                  ))}
                </Nav>
                {pagination.count > 1 && (
                  <Pagination
                    pagination={pagination}
                    itemsPerPage={itemsPerPage}
                    setPagination={setPagination}
                  />
                )}
                <div ref={optionsWithTabs} className={resultsCssClass}>
                  {childrenToRender.slice(pagination.start, pagination.end)}
                </div>
              </Fragment>
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
