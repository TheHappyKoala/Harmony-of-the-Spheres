import React, { ReactElement, Fragment } from 'react';
import { modifyScenarioProperty } from '../../action-creators/scenario';
import Toggle from '../Toggle';

interface GraphicsProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
  barycenter: boolean;
  trails: boolean;
  labels: boolean;
  sizeAttenuation: boolean;
  habitableZone: boolean;
  referenceOrbits: boolean;
}

export default ({
  modifyScenarioProperty,
  barycenter,
  trails,
  labels,
  sizeAttenuation,
  habitableZone,
  referenceOrbits
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
      label="Habitable Zone"
      checked={habitableZone}
      callback={() =>
        modifyScenarioProperty({
          key: 'habitableZone',
          value: !habitableZone
        })
      }
    />
    <Toggle
      label="Reference Orbits"
      checked={referenceOrbits}
      callback={() =>
        modifyScenarioProperty({
          key: 'referenceOrbits',
          value: !referenceOrbits
        })
      }
    />
  </Fragment>
);
