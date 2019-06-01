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
import './Dropdown.less';

interface DropdownProps {
  children: ReactNode;
  selectedOption: string;
  tabs?: {
    cssClass: string;
    activeCssClass: string;
    optionsCssClass: string;
    identifier: string;
  };
  dropdownWrapperCssClassName: string;
  selectedOptionCssClassName: string;
  optionsWrapperCssClass: string;
}

export default memo(
  ({
    children,
    selectedOption,
    tabs,
    dropdownWrapperCssClassName,
    optionsWrapperCssClass,
    selectedOptionCssClassName
  }: DropdownProps): ReactElement => {
    const [options, setOptions] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>('');

    const tabsLabels: string[] = [];

    if (tabs) {
      Children.toArray(children).forEach(
        (entry: ReactElement) =>
          tabsLabels.indexOf(entry.props.identifier) === -1 &&
          tabsLabels.push(entry.props.identifier)
      );

      useEffect(() => setSelectedTab(tabsLabels[0]), []);
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
          <i className="fa fa-chevron-circle-down fa-lg" />
        </div>
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
                  {Children.map(children, (option: ReactElement) => {
                    if (option.props.identifier === selectedTab) return option;
                  })}
                </div>
              </Fragment>
            )}
            {!tabs && children}
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selectedOption === nextProps.selectedOption
);
