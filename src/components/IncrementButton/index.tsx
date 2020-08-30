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
}

export default ({
  callback,
  children,
  cssClassName
}: IncrementButtonProps): ReactElement => {
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (mouseDown) {
      timer = setTimeout(() => {
        callback();
      }, 100);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [mouseDown]);

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
    </div>
  );
};
