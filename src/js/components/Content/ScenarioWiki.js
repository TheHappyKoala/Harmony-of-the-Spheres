import React from 'react';

export default function(props) {
  return (
    <iframe src={props.scenarioWikiUrl} className="scenario-wiki-iframe" />
  );
}
