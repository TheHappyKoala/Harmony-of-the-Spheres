import React from 'react';
import Toggle from '../Toggle';

export default function(props) {
  return (
    <div>
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
    </div>
  );
}
