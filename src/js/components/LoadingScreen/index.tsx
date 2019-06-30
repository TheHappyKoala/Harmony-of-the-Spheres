import React, { ReactElement } from 'react';
import './LoadingScreen.less';

interface LoadingScreenProps {
  scenarioName: string;
  assetBeingLoaded: string;
}

export default ({
  scenarioName,
  assetBeingLoaded
}: LoadingScreenProps): ReactElement => (
  <div className="loading-screen-wrapper">
    <h1>Harmony of the Spheres</h1>
    <p className="sub-title">{scenarioName}</p>
    <p className="asset-being-loaded">{assetBeingLoaded}</p>
    <p className="author-title">By Darrell A. Huffman</p>
    <p className="splash-screen-image-credit">
      North American solar eclipse of 21 August 2017 - Credit: ESO /{' '}
      <a
        href="https://www.eso.org/public/outreach/partnerships/photo-ambassadors/#horalek"
        target="blank"
      >
        P. Horálek
      </a>{' '}
      /{' '}
      <a href="http://project.ifa.hawaii.edu/solarwindsherpas/" target="blank">
        Solar Wind Sherpas project
      </a>
    </p>
  </div>
);
