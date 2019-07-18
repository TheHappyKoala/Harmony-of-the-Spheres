import React, { ReactElement } from 'react';
import './LoadingScreen.less';

interface LoadingScreenProps {
  whatIsLoding: string;
}

export default ({ whatIsLoding }: LoadingScreenProps): ReactElement => (
  <div className="loading-screen-wrapper">
    <h1>Harmony of the Spheres</h1>
    <p className="sub-title">{whatIsLoding}</p>
    <p className="author-title">Open Source Gravity Simulator</p>
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
