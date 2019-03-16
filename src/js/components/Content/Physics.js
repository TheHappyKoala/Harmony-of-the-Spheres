import React, { Fragment } from 'react';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import { integrators } from '../../Physics/Integrators';

export default function(props) {
  return (
    <Fragment>
      <h2>Physics</h2>
      <label className="top">
        Integrator
        <Tooltip
          position="left"
          content="The integration scheme used to calculate position, acceleration and velocity vectors. RK4 is more accurate, but consumes more computing power, so if you are running Gravity Playground on a slow device, Euler might be a better choice of integrator. Note that changing integrators in the middle of a running scenario results in a severe loss of accuracy."
        />
      </label>
      <div className="tabs-dropdown-wrapper">
        <Dropdown selectedOption={props.integrator}>
          {integrators.map(integrator => (
            <div
              name={integrator}
              key={integrator}
              callback={() =>
                props.modifyScenarioProperty({
                  key: 'integrator',
                  value: integrator
                })
              }
            >
              {integrator}
            </div>
          ))}
        </Dropdown>
      </div>
      {(props.integrator === 'RKF' || props.integrator == 'RKN64') && (
        <Fragment>
          <label className="top">
            Error Tolerance
            <Tooltip
              position="left"
              content="The tolerated error according to which delta time is adapted when the RKF integrator is used."
            />
          </label>
          <Slider
            payload={{ key: 'tol' }}
            value={props.tol}
            callback={props.modifyScenarioProperty}
            max={props.maxDt}
            min={props.minDt}
            step={props.dt / 100}
          />
        </Fragment>
      )}
      <label className="top">
        Gravitational Constant
        <Tooltip
          position="left"
          content="The gravitational constant is equal to the absolute value of the gravitational force, acting on a point body with unit mass from another similar body, which is located at the unit distance. Higher values yield a more attractive gravitational force, but what happens if you set a negative value for the gravitational constant?"
        />
      </label>
      <Slider
        payload={{ key: 'g' }}
        value={props.g}
        callback={props.modifyScenarioProperty}
        max={200}
        min={-200}
        step={0.5}
      />
      <Toggle
        label="Collisions"
        checked={props.collisions}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'collisions',
            value: !props.collisions
          })
        }
      />
    </Fragment>
  );
}
