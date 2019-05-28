import React, { ReactElement } from 'react';
import './LoadingScreen.less';

interface LoadingScreenProps {
  scenarioName: string;
}

export default ({ scenarioName }: LoadingScreenProps): ReactElement => (
  <div className="loading-screen-wrapper">
    <h1>Harmony of the Spheres</h1>
    <p className="sub-title">{scenarioName}</p>
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
