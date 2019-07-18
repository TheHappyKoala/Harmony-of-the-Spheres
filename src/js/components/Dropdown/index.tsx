import React, {
  ReactNode,
  memo,
  ReactElement,
  Fragment,
  useState,
  useRef,
  Children
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

    const tabsLabels: string[] = [];

    if (tabs) {
      Children.toArray(children).forEach(
        (entry: ReactElement) =>
          tabsLabels.indexOf(entry.props['data-identifier']) === -1 &&
          tabsLabels.push(entry.props['data-identifier'])
      );
    }

    const optionsWrapper = useRef(null);
    const optionsWithTabs = useRef(null);
    const dropdownTabs = useRef(null);

    const handleOpenOptions = () => {
      if (options) return;

      setOptions(true);
      document.addEventListener('click', handleClickWhenOptionsAreOpen);
    };

    const handleClickWhenOptionsAreOpen = (e: MouseEvent) => {
      if (
        (tabs !== undefined && dropdownTabs.current.contains(e.target)) ||
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
                  <ul ref={dropdownTabs} className={tabs.cssClass}>
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
                  <div className={tabs.optionsCssClass} ref={optionsWithTabs}>
                    {Children.map(
                      children,
                      (option: ReactElement): ReactElement => {
                        if (option.props['data-identifier'] === selectedTab)
                          return option;
                        else return null;
                      }
                    )}
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
