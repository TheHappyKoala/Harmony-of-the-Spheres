import React, { Fragment, useState } from 'react';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import { integrators } from '../../Physics/Integrators';

export default props => {
  const [
    displayAdvancedDeltaTimeControls,
    setAdvancedDeltaTimeControls
  ] = useState(false);

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
      <label className="top">
        Delta Time
        <Tooltip
          position="left"
          content="The time that elapses per iteration of the simulation. The lower the time step, the more accurate the simulation will be, and vice versa."
        />
      </label>
      <Slider
        payload={{ key: 'dt' }}
        value={props.dt}
        callback={props.modifyScenarioProperty}
        max={props.maxDt}
        min={props.minDt}
        step={props.dt / 1000}
      />
      {(props.integrator === 'RKF' ||
        props.integrator === 'RKN64' ||
        props.integrator === 'RKN12') && (
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
          <Toggle
            label="Advanced Delta Time Controls"
            checked={displayAdvancedDeltaTimeControls}
            callback={() =>
              setAdvancedDeltaTimeControls(!displayAdvancedDeltaTimeControls)
            }
          />
          {displayAdvancedDeltaTimeControls && (
            <Fragment>
              <label className="top">
                Min Delta Time
                <Tooltip
                  position="left"
                  content="The minimum allowed value for delta time."
                />
              </label>
              <Slider
                payload={{ key: 'minDt' }}
                value={props.minDt}
                callback={props.modifyScenarioProperty}
                max={10}
                min={0.0000000000000000000001}
                step={props.dt / 1000}
              />
              <label className="top">
                Max Delta Time
                <Tooltip
                  position="left"
                  content="The maximum allowed value for delta time."
                />
              </label>
              <Slider
                payload={{ key: 'maxDt' }}
                value={props.maxDt}
                callback={props.modifyScenarioProperty}
                max={4}
                min={0.0000000000000000000001}
                step={props.dt / 1000}
              />
            </Fragment>
          )}
        </Fragment>
      )}

      <Toggle
        label="System Barycenter"
        checked={props.systemBarycenter}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'systemBarycenter',
            value: !props.systemBarycenter
          })
        }
      />
      {!props.systemBarycenter && (
        <Fragment>
          <label className="top">
            Barycenter Mass One
            <Tooltip
              position="left"
              content="One of the masses in a two body system."
            />
          </label>
          <div className="tabs-dropdown-wrapper">
            <Dropdown selectedOption={props.barycenterMassOne}>
              {props.masses.map(mass => (
                <div
                  name={mass.name}
                  key={mass.name}
                  callback={() =>
                    props.modifyScenarioProperty({
                      key: 'barycenterMassOne',
                      value: mass.name
                    })
                  }
                >
                  {mass.name}
                </div>
              ))}
            </Dropdown>
          </div>
          <label className="top">
            Barycenter Mass Two
            <Tooltip
              position="left"
              content="One of the masses in a two body system."
            />
          </label>
          <div className="tabs-dropdown-wrapper">
            <Dropdown selectedOption={props.barycenterMassTwo}>
              {props.masses.map(mass => (
                <div
                  name={mass.name}
                  key={mass.name}
                  callback={() =>
                    props.modifyScenarioProperty({
                      key: 'barycenterMassTwo',
                      value: mass.name
                    })
                  }
                >
                  {mass.name}
                </div>
              ))}
            </Dropdown>
          </div>
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
};
