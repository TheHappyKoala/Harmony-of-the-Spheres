import React, { memo, ReactElement, useState, useRef, ReactNode } from "react";
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
          <i className={"fa fa-chevron-circle-down"} />
        </div>
        {options && (
          <div ref={optionsWrapper} className={optionsWrapperCssClass}>
            {children}
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selectedOption === nextProps.selectedOption
);
