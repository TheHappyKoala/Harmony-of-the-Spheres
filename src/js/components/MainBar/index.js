import React from 'react';
import './MainBar.less';
import { NavLink } from 'react-router-dom';
import Dropdown from '../Dropdown';
import { scenarios } from '../../data/scenarios';

export default function(props) {
  return (
    <div className="main-bar">
      <label className="inline">Scenario</label>
      <div className="item scenario-dropdown-wrapper inline">
        <Dropdown selectedOption={props.scenario.name}>
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
      </div>
      <div className="play-state-wrapper inline">
        {!props.scenario.playing && (
          <i
            className="fas fa-play fa-lg"
            onClick={() =>
              props.modifyScenarioProperty({ key: 'playing', value: true })
            }
          />
        )}
        {props.scenario.playing && (
          <i
            className="fas fa-pause fa-lg"
            onClick={() =>
              props.modifyScenarioProperty({ key: 'playing', value: false })
            }
          />
        )}
      </div>
      <div className="elapsed-time-wrapper item inline">
        <i className="fas fa-clock-o fa-lg inline" />
        <div className="inline">
          <p className="elapsed-time">{`[ Years ]: ${props.scenario.elapsedTime.toFixed(
            4
          )}`}</p>
        </div>
      </div>
    </div>
  );
}
