import React, { ReactElement, Fragment } from 'react';
import Toggle from '../Toggle';

interface GraphicsProps {
  modifyScenarioProperty: Function;
  barycenter: Boolean;
  trails: Boolean;
  labels: Boolean;
  background: Boolean;
  sizeAttenuation: Boolean;
}

export default ({
  modifyScenarioProperty,
  barycenter,
  trails,
  labels,
  background,
  sizeAttenuation
}: GraphicsProps): ReactElement => (
  <Fragment>
    <h2>Graphics</h2>
    <Toggle
      label="Display Barycenter"
      checked={barycenter}
      callback={() =>
        modifyScenarioProperty({
          key: 'barycenter',
          value: !barycenter
        })
      }
    />
    <Toggle
      label="Trails"
      checked={trails}
      callback={() =>
        modifyScenarioProperty({
          key: 'trails',
          value: !trails
        })
      }
    />
    <Toggle
      label="Labels"
      checked={labels}
      callback={() =>
        modifyScenarioProperty({
          key: 'labels',
          value: !labels
        })
      }
    />
    <Toggle
      label="Starfield Background"
      checked={background}
      callback={() =>
        modifyScenarioProperty({
          key: 'background',
          value: !background
        })
      }
    />
    <Toggle
      label="Particle Size Attenuation"
      checked={sizeAttenuation}
      callback={() =>
        modifyScenarioProperty({
          key: 'sizeAttenuation',
          value: !sizeAttenuation
        })
      }
    />
  </Fragment>
);
