import React from 'react';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import { integrators } from '../../Physics';

export default function(props) {
  return (
    <div>
      <h2>Physics</h2>
      <label className="top">
        Integrator
        <Tooltip
          position="left"
          content="The integration scheme used to calculate position, acceleration and velocity vectors. RK4 is more accurate, but consumes more computing power, so if you are running Gravity Playground on a slow device, Euler might be a better choice of integrator."
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
      <Toggle
        label="Collisions"
        checked={props.collisions}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'collisions',
            value: !props.scenario.collisions
          })
        }
      />
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
      <label className="top">
        Time Step
        <Tooltip
          position="left"
          content="The time step is the time that elapses for each tick of the simulation. A lower time step makes for a more accurate simulation. If you assign a negativevalue to the time step, the simulation will run backwards in time instead of forwards."
        />
      </label>
      <Slider
        payload={{ key: 'dt' }}
        value={props.dt}
        callback={props.modifyScenarioProperty}
        max={2}
        min={-2}
        step={0.0000000001}
      />
    </div>
  );
}
