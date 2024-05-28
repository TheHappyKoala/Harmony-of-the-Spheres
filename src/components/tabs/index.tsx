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
  contentWrapperCssClassName?: string;
  contentWrapperCloseButtonCssClassName?: string;
  navigationMenuCssModifier?: string;
  closeButton?: boolean;
};

const Tabs = ({
  children,
  contentWrapperCssClassName,
  contentWrapperCloseButtonCssClassName,
  navigationMenuCssModifier,
  closeButton,
}: Props): ReactElement => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(-1);

  const content = Children.toArray(children);

  return (
    <Fragment>
      <NavigationMenu cssModifier={navigationMenuCssModifier}>
        {content.map((child, i) => {
          return (
            <NavigationMenuItem
              active={selectedTabIndex === i}
              callback={() => setSelectedTabIndex(i)}
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
                    <span>{child.props["data-label"]}</span>
                  ) : null}
                </Fragment>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenu>
      {selectedTabIndex !== -1 ? (
        <div
          className={
            contentWrapperCssClassName ? contentWrapperCssClassName : ""
          }
        >
          {closeButton && (
            <i
              className={`fa-solid fa-xmark ${
                contentWrapperCloseButtonCssClassName
                  ? contentWrapperCloseButtonCssClassName
                  : ""
              }`}
              onClick={() => setSelectedTabIndex(-1)}
            />
          )}
          {content[selectedTabIndex]}
        </div>
      ) : null}
    </Fragment>
  );
};

export default Tabs;
