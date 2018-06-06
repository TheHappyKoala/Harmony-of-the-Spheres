import React from 'react';
import { NavLink } from 'react-router-dom';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
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
    </div>
  );
}
