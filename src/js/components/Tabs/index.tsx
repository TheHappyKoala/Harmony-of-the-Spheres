import React, {
  ReactElement,
  Fragment,
  useState,
  Children,
  ReactChildren,
  isValidElement
} from 'react';

interface TabsProps {
  initTab?: number;
  tabsWrapperClassName?: string;
  tabsContentClassName?: string;
  children: ReactChildren;
}

export default ({
  initTab,
  tabsWrapperClassName,
  tabsContentClassName,
  children
}: TabsProps): ReactElement => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    initTab !== undefined ? initTab : -1
  );

  const panes = Children.toArray(children);

  return (
    <div className={tabsWrapperClassName}>
      <ul>
        {panes.map((child, i) => (
          <li
            key={i}
            onClick={() => setSelectedTabIndex(i)}
            className={i === selectedTabIndex ? 'active-sidebar-tab' : ''}
          >
            {isValidElement<{
              ['data-label']?: string;
              ['data-icon']?: string;
            }>(child) && (
              <Fragment>
                {child.props['data-icon'] !== undefined && (
                  <i className={child.props['data-icon']} />
                )}
                <p>{child.props['data-label']}</p>
              </Fragment>
            )}
          </li>
        ))}
      </ul>
      {selectedTabIndex !== -1 && (
        <div className={tabsContentClassName}>
          {panes[selectedTabIndex]}
          <i
            className="fa fa-window-close fa-2x tabs-close-button"
            onClick={() => setSelectedTabIndex(-1)}
          />
        </div>
      )}
    </div>
  );
};
