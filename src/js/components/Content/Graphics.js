import React from 'react';
import Toggle from '../Toggle';

export default function(props) {
  return (
    <React.Fragment>
      <h2>Graphics</h2>
      <Toggle
        label="Trails"
        checked={props.trails}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'trails',
            value: !props.trails
          })
        }
      />
      <Toggle
        label="Labels"
        checked={props.labels}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'labels',
            value: !props.labels
          })
        }
      />
      <Toggle
        label="Starfield Background"
        checked={props.background}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'background',
            value: !props.background
          })
        }
      />
      <Toggle
        label="Particle Size Attenuation"
        checked={props.sizeAttenuation}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'sizeAttenuation',
            value: !props.sizeAttenuation
          })
        }
      />
    </React.Fragment>
  );
}
