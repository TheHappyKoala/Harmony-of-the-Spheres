import React from 'react';
import './MainBar.less';
import { NavLink } from 'react-router-dom';
import Dropdown from '../Dropdown';
import LazyDog from '../LazyDog';
import Tweet from '../Tweet';
import { scenarios } from '../../data/scenarios';

export default props => (
  <div className="main-bar">
    <label className="inline">Scenario</label>
    <Dropdown
      selectedOption={props.scenario.name}
      tabs={{
        cssClass: 'dropdown-tabs',
        activeCssClass: 'dropdown-tabs-active',
        optionsCssClass: 'dropdown-content',
        identifier: 'category'
      }}
      dropdownWrapperCssClassName="item scenario-dropdown-wrapper inline"
      selectedOptionCssClassName="selected-option"
      optionsWrapperCssClass="scenario-menu"
    >
      {scenarios.map(scenario => (
        <div
          className="scenario-menu-option"
          key={scenario.name}
          identifier={scenario.type}
        >
          <NavLink to={`/scenario/${scenario.name}`} name={scenario.name}>
            <LazyDog
              src={`./images/scenarios/${scenario.name}.png`}
              alt={scenario.name}
              caption={scenario.name}
              width={220}
              height={138}
              placeHolderIcon="fa fa-venus-mars fa-2x"
            />
          </NavLink>
        </div>
      ))}
    </Dropdown>
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
    <Tweet
      shareText={`Hey friends! Check out this 3D gravity simulation of ${
        props.scenario.name
      }. It will run in your browser :)!`}
      shareUrl={document.location.toString()}
      callToAction=""
      cssClassName="fa fa-twitter fa-2x twitter-box"
      hashtags="Space,HarmonyOfTheSpheres,Science"
    />
  </div>
);
