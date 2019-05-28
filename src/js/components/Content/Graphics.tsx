import React, { ReactElement, Fragment } from 'react';
import { modifyScenarioProperty } from '../../action-creators/scenario';
import Toggle from '../Toggle';

interface GraphicsProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
  barycenter: boolean;
  trails: boolean;
  labels: boolean;
  background: boolean;
  sizeAttenuation: boolean;
  twinklingParticles: boolean;
}

export default ({
  modifyScenarioProperty,
  barycenter,
  trails,
  labels,
  background,
  sizeAttenuation,
  twinklingParticles
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
    <Toggle
      label="Twinkling Particles"
      checked={twinklingParticles}
      callback={() =>
        modifyScenarioProperty({
          key: 'twinklingParticles',
          value: !twinklingParticles
        })
      }
    />
  </Fragment>
);
