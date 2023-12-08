import React, {
  Children,
  useState,
  ReactElement,
  ReactNode,
  isValidElement,
  Fragment,
} from "react";
import NavigationMenu from "../navigation-menu";
import NavigationMenuItem from "../navigation-menu/navigation-menu-item";

type Props = {
  children: ReactNode;
  contentClassName?: string;
  navigationMenuCssClassName?: string;
  navigationMenuItemCssClassName?: string;
  navigationMenuItemActiveCssClassName?: string;
  closeButton?: boolean;
  closeButtonIconCssClassName?: string;
};

const Tabs = ({
  children,
  contentClassName,
  navigationMenuCssClassName,
  navigationMenuItemCssClassName,
  navigationMenuItemActiveCssClassName,
  closeButton,
  closeButtonIconCssClassName,
}: Props): ReactElement => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(-1);

  const content = Children.toArray(children);

  return (
    <div>
      <NavigationMenu cssClassName={navigationMenuCssClassName}>
        {content.map((child, i) => {
          return (
            <NavigationMenuItem
              active={selectedTabIndex === i}
              activeCssClassName={navigationMenuItemActiveCssClassName}
              callback={() => setSelectedTabIndex(i)}
              cssClassName={navigationMenuItemCssClassName}
            >
              {isValidElement<{
                ["data-label"]?: string;
                ["data-icon"]?: string;
              }>(child) && (
                <Fragment>
                  {child.props["data-icon"] ? (
                    <i className={child.props["data-icon"]} />
                  ) : null}
                  {child.props["data-label"] ? (
                    <label>{child.props["data-label"]}</label>
                  ) : null}
                </Fragment>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenu>
      {selectedTabIndex !== -1 ? (
        <div className={contentClassName ? contentClassName : ""}>
          {closeButton && (
            <i
              className={
                closeButtonIconCssClassName ? closeButtonIconCssClassName : ""
              }
              onClick={() => setSelectedTabIndex(-1)}
            />
          )}
          {content[selectedTabIndex]}
        </div>
      ) : null}
    </div>
  );
};

export default Tabs;
