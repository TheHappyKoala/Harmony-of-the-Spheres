import React, {
  ReactElement,
  ReactChildren,
  ReactChild,
  useState,
  useEffect,
  useCallback
} from "react";

interface IncrementButtonProps {
  callback: () => void;
  children: ReactChildren | ReactChild;
  cssClassName: string;
  timeout: number;
  value: number;
  withValue: boolean;
  valueCssClass?: string;
}

export default ({
  callback,
  children,
  cssClassName,
  timeout,
  value,
  withValue,
  valueCssClass
}: IncrementButtonProps): ReactElement => {
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
    setMouseDown(false);
  }, [mouseDown]);

  return (
    <div
      className={cssClassName}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
      {withValue && <div className={valueCssClass}>{value}</div>}
    </div>
  );
};
