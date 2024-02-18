import React, { ReactElement } from "react";
import {
  backgroundWrapper,
  stars,
  planet,
  planetHostStar,
} from "./background.module.css";

const Background = (): ReactElement => (
  <div className={backgroundWrapper}>
    <div className={stars}></div>
    <div className={stars}></div>
    <div className={stars}></div>
    <div className={stars}></div>
    <div className={stars}></div>
    <div className={planet}></div>
    <div className={planetHostStar}></div>
  </div>
);

export default Background;
