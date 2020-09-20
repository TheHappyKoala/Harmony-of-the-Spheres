import React, {
  ReactElement,
  ReactChildren,
  ReactChild,
  useState,
  useEffect,
  useCallback
} from "react";

interface MousePressButtonProps {
  callback: () => void;
  children: ReactChildren | ReactChild;
  cssClassName: string;
  timeout: number;
  value: any;
  withValue: boolean;
  valueCssClass?: string;
  onMouseUpCallback?: () => void;
}

export default ({
  callback,
  children,
  cssClassName,
  timeout,
  value,
  withValue,
  valueCssClass,
  onMouseUpCallback
}: MousePressButtonProps): ReactElement => {
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | void;

    if (mouseDown) {
      timer = setTimeout(() => {
        callback();
      }, timeout);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [mouseDown, value]);

  const handleMouseDown = useCallback(() => {
    setMouseDown(true);
  }, [mouseDown]);

  const handleMouseUp = useCallback(() => {
    onMouseUpCallback && onMouseUpCallback();

    setMouseDown(false);
  }, [mouseDown, onMouseUpCallback]);

  return (
    <div
      className={cssClassName}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {children}
      {withValue && <div className={valueCssClass}>{value}</div>}
    </div>
  );
};
