import React from 'react';
import { NavLink } from 'react-router-dom';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
import Slider from '../Slider';
import Button from '../Button';
import { scenarios } from '../../data/scenarios';
import play from '../../../icons/play.png';
import pause from '../../../icons/pause.png';
import './GlobalInputs.less';

export default function(props) {
  return (
    <div className="global-inputs">
      <label>Scenario</label>
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
      <label className="top">Camera Position</label>
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
      <label className="top">Camera Focus</label>
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
      <label className="top">Gravitational Constant</label>
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
