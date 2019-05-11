import React, { useState, Children } from 'react';

export default props => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(
    props.initTab !== undefined ? props.initTab : -1
  );

  return (
    <div className={props.tabsWrapperClassName}>
      <ul>
        {Children.toArray(props.children).map((child, i) => (
          <li
            key={i}
            onClick={() => setSelectedTabIndex(i)}
            className={i === selectedTabIndex ? 'active-sidebar-tab' : ''}
          >
            {child.props.icon !== undefined && (
              <i className={child.props.icon} />
            )}
            <p>{child.props.label}</p>
          </li>
        ))}
      </ul>
      {selectedTabIndex !== -1 && (
        <div className={props.tabsContentClassName}>
          {props.children[selectedTabIndex]}
          <i
            className="fa fa-window-close fa-2x tabs-close-button"
            onClick={() => setSelectedTabIndex(-1)}
          />
        </div>
      )}
    </div>
  );
};
