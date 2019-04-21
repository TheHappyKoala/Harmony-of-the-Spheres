import React from 'react';
import './LoadingScreen.less';

export default props => (
  <div className="loading-screen-wrapper">
    <h1>Harmony of the Spheres</h1>
    <p className="sub-title">{props.scenarioName}</p>
    <div className="spinner">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
    <p className="author-title">
      <b>Created by Darrell A. Huffman</b>
    </p>
  </div>
);
