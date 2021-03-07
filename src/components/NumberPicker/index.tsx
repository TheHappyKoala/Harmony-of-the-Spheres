import React, { useEffect, useCallback, useState } from "react";

interface NumberPickerInterface {
  callback: Function;
  numbers: number[];
  icon?: string;
  payload: any;
  payloadKey: string;
}

export default ({
  callback,
  numbers,
  icon,
  payload,
  payloadKey
}: NumberPickerInterface) => {
  const [selectedNumber, setSelectedNumber] = useState(numbers[0]);

  useEffect(() => callback({ ...payload, [payloadKey]: selectedNumber }), []);

  const handleClick = useCallback(
    (number: number) => () => {
      setSelectedNumber(number);
      callback({ ...payload, [payloadKey]: number });
    },
    []
  );

  return (
    <div>
      {numbers.map(number =>
        icon ? (
          <i
            className={icon}
            style={{
              border: number === selectedNumber ? "3px solid limegreen" : "none"
            }}
            onClick={handleClick(number)}
          />
        ) : (
          <span
            style={{
              border: number === selectedNumber ? "3px solid limegreen" : "none"
            }}
            onClick={handleClick(number)}
          >
            {number}
          </span>
        )
      )}
    </div>
  );
};
