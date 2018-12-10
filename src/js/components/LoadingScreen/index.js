import React from 'react';
import './LoadingScreen.less';

export default function() {
  return (
    <div className="loading-screen-wrapper">
      <h1>Harmony of the Spheres</h1>
      <p className="sub-title">Gravitational N-Body Simulator</p>
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
      <p className="author-title">
        <b>Created by Darrell Arjuna Huffman</b>
      </p>
    </div>
  );
}
