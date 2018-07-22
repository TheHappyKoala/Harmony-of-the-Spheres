import React from 'react';
import { NavLink } from 'react-router-dom';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
import Slider from '../Slider';
import Button from '../Button';
import Tooltip from '../Tooltip';
import { scenarios } from '../../data/scenarios';
import play from '../../../icons/play.png';
import pause from '../../../icons/pause.png';
import './GlobalInputs.less';

export default function(props) {
  return (
    <div className="global-inputs">
      <label>
        Scenario
        <Tooltip
          position="right"
          content="Select the scenario that you want to simulate. Options range from the Jovian system to a beautiful three-body coreography."
        />
      </label>
      <Dropdown>
        {scenarios.map(scenario => (
          <NavLink
            to={`/scenario/${scenario.name}`}
            name={scenario.name}
            key={scenario.name}
          >
            {scenario.name}
          </NavLink>
        ))}
      </Dropdown>
      {!props.scenario.playing && (
        <Button
          callback={() =>
            props.modifyScenarioProperty({ key: 'playing', value: true })
          }
        >
          <img src={play} alt="play" />
        </Button>
      )}
      {props.scenario.playing && (
        <Button
          callback={() =>
            props.modifyScenarioProperty({
              key: 'playing',
              value: false
            })
          }
        >
          <img src={pause} alt="pause" />
        </Button>
      )}
      <Toggle
        label="Trails"
        checked={props.scenario.trails}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'trails',
            value: !props.scenario.trails
          })
        }
      />
      <Toggle
        label="Labels"
        checked={props.scenario.labels}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'labels',
            value: !props.scenario.labels
          })
        }
      />
      <Toggle
        label="Collisions"
        checked={props.scenario.collisions}
        callback={() =>
          props.modifyScenarioProperty({
            key: 'collisions',
            value: !props.scenario.collisions
          })
        }
      />
      <label className="top">
        Rotating Reference Frame{' '}
        <Tooltip
          position="right"
          content="A rotating frame of reference is a special case of a non-inertial reference frame that is rotating relative to an inertial reference frame. In more digestable parlance, rotating reference frames allow us to observe the universe unfold relative to a fixed point, for instance Earth. While Earth orbits the Sun regardless of the reference frame being considered, in a rotating reference frame, the sun, for example, will appear to orbit the Earth, which is fixed at the center of the coordinate system. This makes observing the perturbations of the Sun on the Moon in its orbit around Earth easier to observe, while also revealing the peculiar nature of resonant orbits, like that of Cruithne, a quasi Moon of Earth."
        />
      </label>
      <Dropdown>
        {props.scenario.masses.map(mass => (
          <div
            name={mass.name}
            key={mass.name}
            callback={() =>
              props.modifyScenarioProperty({
                key: 'rotatingReferenceFrame',
                value: mass.name
              })
            }
          >
            {mass.name}
          </div>
        ))}
      </Dropdown>
      <label className="top">
        Camera Position{' '}
        <Tooltip
          position="right"
          content="Select the position of the camera. If the position is set to free, you can zoom in on and orbit around the focus of the camera with your mouse or touch screen."
        />
      </label>
      <Dropdown>
        <div
          name="Free"
          key="Free"
          callback={() =>
            props.modifyScenarioProperty({
              key: 'cameraPosition',
              value: 'Free'
            })
          }
        >
          Free
        </div>
        {props.scenario.masses.map(mass => (
          <div
            name={mass.name}
            key={mass.name}
            callback={() =>
              props.modifyScenarioProperty({
                key: 'cameraPosition',
                value: mass.name
              })
            }
          >
            {mass.name}
          </div>
        ))}
      </Dropdown>
      <label className="top">
        Camera Focus{' '}
        <Tooltip
          position="right"
          content="Select the focus of the camera, or in other words, what the camera should be looking at."
        />
      </label>
      <Dropdown>
        <div
          name="Origo"
          key="Origo"
          callback={() =>
            props.modifyScenarioProperty({
              key: 'cameraFocus',
              value: 'Origo'
            })
          }
        >
          Origo
        </div>
        {props.scenario.masses.map(mass => (
          <div
            name={mass.name}
            key={mass.name}
            callback={() =>
              props.modifyScenarioProperty({
                key: 'cameraFocus',
                value: mass.name
              })
            }
          >
            {mass.name}
          </div>
        ))}
      </Dropdown>
      <label className="top">
        Gravitational Constant
        <Tooltip
          position="right"
          content="The gravitational constant is equal to the absolute value of the gravitational force, acting on a point body with unit mass from another similar body, which is located at the unit distance. Higher values yield a more attractive gravitational force, but what happens if you set a negative value for the gravitational constant?"
        />
      </label>
      <Slider
        val={props.scenario.g}
        callback={e =>
          props.modifyScenarioProperty({
            key: 'g',
            value: e.target.value
          })
        }
        max={200}
        min={-200}
        step={0.5}
      />
    </div>
  );
}
