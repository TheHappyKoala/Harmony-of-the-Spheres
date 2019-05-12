import React, { ReactElement, Fragment, useState } from 'react';
import { MassType } from '../../Physics/types';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import { integrators } from '../../Physics/Integrators';

interface PhysicsProps {
  modifyScenarioProperty: Function;
  masses: MassType[];
  integrator: string;
  useBarnesHut: Boolean;
  systemBarycenter: Boolean;
  collisions: Boolean;
  dt: number;
  tol: number;
  minDt: number;
  maxDt: number;
  g: number;
  softeningConstant: number;
  barycenterMassOne: string;
  barycenterMassTwo: string;
  theta: number;
}

export default ({
  modifyScenarioProperty,
  masses,
  integrator,
  useBarnesHut,
  collisions,
  dt,
  tol,
  minDt,
  maxDt,
  g,
  softeningConstant,
  systemBarycenter,
  barycenterMassOne,
  barycenterMassTwo,
  theta
}: PhysicsProps): ReactElement => {
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
        <Dropdown selectedOption={integrator}>
          {integrators.map(integrator => (
            <div
              data-name={integrator}
              data-key={integrator}
              data-callback={() =>
                modifyScenarioProperty({
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
      <Toggle
        label="Use Barnes-Hut"
        checked={useBarnesHut}
        callback={() =>
          modifyScenarioProperty({
            key: 'useBarnesHut',
            value: !useBarnesHut
          })
        }
      />
      {useBarnesHut && (
        <Fragment>
          <label className="top">
            Barnes-Hut Theta Parameter
            <Tooltip
              position="left"
              content="A value of zero for Theta corresponds to naïve comparison with all masses in the simulation, which is equivalent to a brute force approach. Higher values starts treating masses that are very far away as a single mass to reduce the number of calculations necessary to calculate the acceleration on a mass, which is a reasonable approximation provided these masses are sufficiently far away."
            />
          </label>
          <Slider
            payload={{ key: 'theta' }}
            value={theta}
            callback={modifyScenarioProperty}
            max={5}
            min={0}
            step={0.1}
          />
        </Fragment>
      )}
      <label className="top">
        Delta Time
        <Tooltip
          position="left"
          content="The time that elapses per iteration of the simulation. The lower the time step, the more accurate the simulation will be, and vice versa."
        />
      </label>
      <Slider
        payload={{ key: 'dt' }}
        value={dt}
        callback={modifyScenarioProperty}
        max={maxDt}
        min={minDt}
        step={dt / 1000}
      />
      {(integrator === 'RKF' ||
        integrator === 'RKN64' ||
        integrator === 'RKN12') && (
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
            value={tol}
            callback={modifyScenarioProperty}
            max={maxDt}
            min={minDt}
            step={dt / 100}
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
                value={minDt}
                callback={modifyScenarioProperty}
                max={10}
                min={0.0000000000000000000001}
                step={dt / 1000}
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
                value={maxDt}
                callback={modifyScenarioProperty}
                max={4}
                min={0.0000000000000000000001}
                step={dt / 1000}
              />
            </Fragment>
          )}
        </Fragment>
      )}

      <Toggle
        label="System Barycenter"
        checked={systemBarycenter}
        callback={() =>
          modifyScenarioProperty({
            key: 'systemBarycenter',
            value: !systemBarycenter
          })
        }
      />
      {!systemBarycenter && (
        <Fragment>
          <label className="top">
            Barycenter Mass One
            <Tooltip
              position="left"
              content="One of the masses in a two body system."
            />
          </label>
          <div className="tabs-dropdown-wrapper">
            <Dropdown selectedOption={barycenterMassOne}>
              {masses.map(mass => (
                <div
                  data-name={mass.name}
                  data-key={mass.name}
                  data-callback={() =>
                    modifyScenarioProperty({
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
            <Dropdown selectedOption={barycenterMassTwo}>
              {masses.map(mass => (
                <div
                  data-name={mass.name}
                  data-key={mass.name}
                  data-callback={() =>
                    modifyScenarioProperty({
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
        value={g}
        callback={modifyScenarioProperty}
        max={200}
        min={-200}
        step={0.5}
      />
      <Toggle
        label="Collisions"
        checked={collisions}
        callback={() =>
          modifyScenarioProperty({
            key: 'collisions',
            value: !collisions
          })
        }
      />
      <label className="top">
        Softening Constant
        <Tooltip
          position="left"
          content="The gravitational constant is equal to the absolute value of the gravitational force, acting on a point body with unit mass from another similar body, which is located at the unit distance. Higher values yield a more attractive gravitational force, but what happens if you set a negative value for the gravitational constant?"
        />
      </label>
      <Slider
        payload={{ key: 'softeningConstant' }}
        value={softeningConstant}
        callback={modifyScenarioProperty}
        max={10}
        min={0}
        step={0.0000000000000001}
      />
    </Fragment>
  );
};
