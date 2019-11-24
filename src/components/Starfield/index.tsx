import React, { ReactElement } from "react";
import "./Starfield.less";

export default (): ReactElement => (
  <div className="starfield-wrapper">
    <div className="stars" />
    <div className="twinkling" />
  </div>
);
