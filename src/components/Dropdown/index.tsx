import React, { memo, ReactElement, useState, useRef, ReactNode } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "./Dropdown.less";

interface DropdownProps {
  children: ReactNode;
  selectedOption: string;
  dropdownWrapperCssClassName: string;
  selectedOptionCssClassName: string;
  optionsWrapperCssClass: string;
}

export default memo(
  ({
    children,
    selectedOption,
    dropdownWrapperCssClassName,
    selectedOptionCssClassName,
    optionsWrapperCssClass
  }: DropdownProps): ReactElement => {
    const [options, setOptions] = useState(false);

    const optionsWrapper = useRef(null);

    const handleOpenOptions = () => {
      if (options) return;

      setOptions(true);
      document.addEventListener("click", handleClickWhenOptionsAreOpen);
    };

    const handleClickWhenOptionsAreOpen = (e: MouseEvent) => {
      if (e.target === optionsWrapper.current) return;

      setOptions(false);

      document.removeEventListener("click", handleClickWhenOptionsAreOpen);
    };

    return (
      <div className={dropdownWrapperCssClassName}>
        <div
          onClick={handleOpenOptions}
          data-options={options}
          className={selectedOptionCssClassName}
        >
          {selectedOption}
          <i
            className={`fa fa-chevron-down ${options ? "rotated-chevron" : ""}`}
          />
        </div>
        <ReactCSSTransitionGroup
          transitionName="fall"
          transitionEnterTimeout={150}
          transitionLeaveTimeout={150}
        >
          {options && (
            <div ref={optionsWrapper} className={optionsWrapperCssClass}>
              {children}
            </div>
          )}
        </ReactCSSTransitionGroup>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selectedOption === nextProps.selectedOption
);
