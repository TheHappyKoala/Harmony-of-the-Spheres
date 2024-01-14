import React, {
  ReactElement,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type DropdownProps = {
  children: ReactNode;
  selectedOption: string;
  dropdownWrapperCssClassName: string;
  selectedOptionCssClassName: string;
  optionsWrapperCssClass: string;
};

export default ({
  children,
  selectedOption,
  dropdownWrapperCssClassName,
  selectedOptionCssClassName,
  optionsWrapperCssClass,
}: DropdownProps): ReactElement => {
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
    <div className={dropdownWrapperCssClassName}>
      <div
        onClick={handleOpenOptions}
        className={selectedOptionCssClassName}
        ref={selectedOptionRef}
      >
        {selectedOption}
        <i
          className={`fa fa-chevron-down ${
            displayOptions ? "rotated-chevron" : ""
          }`}
        />
      </div>
      {displayOptions && (
        <div ref={optionsWrapper} className={optionsWrapperCssClass}>
          {children}
        </div>
      )}
    </div>
  );
};
