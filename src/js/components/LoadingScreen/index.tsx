import React, { ReactElement } from 'react';
import './LoadingScreen.less';

interface LoadingScreenProps {
  whatIsLoding: string;
}

export default ({ whatIsLoding }: LoadingScreenProps): ReactElement => (
  <div className="loading-screen-wrapper">
    <div className="stars" />
    <div className="twinkling" />
    <div className="clouds" />
    <div className="blue-overlay" />
    <img src="./images/ringedplanet.png" className="ringed-planet" />
    <h1 className="hos">Harmony of the Spheres</h1>
    <h2 className="what-is-loading">{whatIsLoding}</h2>
  </div>
);
