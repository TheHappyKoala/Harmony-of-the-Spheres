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
              color: number === selectedNumber ? "#fff" : "#a9a9a9"
            }}
            onClick={handleClick(number)}
          />
        ) : (
          <span
            style={{
              border: number === selectedNumber ? "3px solid #a9a9a9" : "none",
              borderRadius: "100%"
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
