import React, {
  ReactElement,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  dropdownWrapper,
  dropdownSelectedOption,
  dropdownOptionsWrapper,
  rotatedChevron,
} from "./dropdown.module.css";

type DropdownProps = {
  children: ReactNode;
  selectedOption: string;
};

export default ({ children, selectedOption }: DropdownProps): ReactElement => {
  const [displayOptions, setDisplayOptions] = useState(false);

  const handleOpenOptions = useCallback(() => {
    setDisplayOptions(!displayOptions);
  }, [displayOptions, setDisplayOptions]);

  const optionsWrapper = useRef(null);
  const selectedOptionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target !== selectedOptionRef.current) {
        setDisplayOptions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedOptionRef, setDisplayOptions, displayOptions]);

  return (
    <div className={dropdownWrapper}>
      <div
        onClick={handleOpenOptions}
        className={dropdownSelectedOption}
        ref={selectedOptionRef}
      >
        {selectedOption}
        <i
          className={`fa fa-chevron-down ${
            displayOptions ? rotatedChevron : ""
          }`}
        />
      </div>
      {displayOptions && (
        <div ref={optionsWrapper} className={dropdownOptionsWrapper}>
          {children}
        </div>
      )}
    </div>
  );
};
