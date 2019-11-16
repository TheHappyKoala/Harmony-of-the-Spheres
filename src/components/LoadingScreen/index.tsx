import React, { ReactElement } from "react";
import "./LoadingScreen.less";

export default (): ReactElement => (
  <div className="loading-screen-wrapper">
    <div className="stars" />
    <div className="twinkling" />
    <div className="clouds" />
    <div className="blue-overlay" />
    <img src="./images/ringedplanet.png" className="ringed-planet" />
  </div>
);
