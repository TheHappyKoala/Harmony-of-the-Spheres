import React, {
  ReactElement,
  Fragment,
  useState,
  ReactNode,
  Children,
  isValidElement,
  useEffect
} from "react";
import Nav from "../Nav";
import NavItem from "../NavItem";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

interface TabsProps {
  initTab?: number;
  tabsWrapperClassName?: string;
  tabsContentClassName?: string;
  children: ReactNode;
  transition: {
    name?: string;
    enterTimeout: number | boolean;
    leaveTimeout: number | boolean;
  };
  noCloseButton?: boolean;
  onTabClickCallback?: Function;
}

export default ({
  initTab,
  tabsWrapperClassName,
  tabsContentClassName,
  children,
  transition,
  noCloseButton,
  onTabClickCallback
}: TabsProps): ReactElement => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    initTab === undefined ? -1 : initTab
  );

  const panes = Children.toArray(children);

  return (
    <div className={tabsWrapperClassName}>
      <Nav>
        {panes.map((child, i) => (
          <NavItem
            key={i}
            callback={() => {
              setSelectedTabIndex(i);
              onTabClickCallback &&
                onTabClickCallback({
                  key: "activeTab",
                  value: child.props["data-label"]
                });
            }}
            active={selectedTabIndex === i}
          >
            {isValidElement<{
              ["data-label"]?: string;
              ["data-icon"]?: string;
            }>(child) && (
              <Fragment>
                <span>
                  <i
                    className={`${
                      child.props["data-icon"] ? child.props["data-icon"] : ""
                    }`}
                  />
                  {child.props["data-label"]}
                </span>
              </Fragment>
            )}
          </NavItem>
        ))}
      </Nav>
      <ReactCSSTransitionGroup
        transitionName={transition.name}
        transitionEnterTimeout={transition.enterTimeout}
        transitionLeaveTimeout={transition.leaveTimeout}
      >
        {selectedTabIndex !== -1 && (
          <div className={tabsContentClassName}>
            {!noCloseButton && (
              <i
                className="fa fa-close close-button"
                onClick={() => setSelectedTabIndex(-1)}
              />
            )}
            {panes[selectedTabIndex]}
          </div>
        )}
      </ReactCSSTransitionGroup>
    </div>
  );
};
