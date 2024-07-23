import React, { ChangeEvent } from "react";
import { slider, range, sliderValue } from "./slider.module.css";

type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Slider = ({ min, max, step, value, onChange }: SliderProps) => {
  return (
    <div className={slider}>
      <div className={sliderValue}>{value}</div>
      <input
        className={range}
        min={min}
        max={max}
        step={step}
        value={value}
        type="range"
        onChange={onChange}
      />
    </div>
  );
};

export default Slider;
