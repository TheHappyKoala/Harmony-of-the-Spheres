import React, { Component } from 'react';
import Dropdown from '../Dropdown';
import Button from '../Button';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import bodies from '../../data/masses';
import distances from '../../data/distances';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      m: 0,
      distance: props.distanceStep.value
    };
  }

  modifyProperty = payload =>
    this.setState({ ...this.state, [payload.key]: payload.value });

  render() {
    return (
      <div>
        <h2>Add Mass</h2>
        <label className="top">
          Primary
          <Tooltip
            position="left"
            content="The celestial object you want your mass to orbit."
          />
        </label>
        <div className="tabs-dropdown-wrapper">
          <Dropdown selectedProperty={this.props.primary}>
            {this.props.masses.map(mass => (
              <div
                name={mass.name}
                key={mass.name}
                callback={() =>
                  this.props.modifyScenarioProperty({
                    key: 'primary',
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
          Distance Step
          <Tooltip
            position="left"
            content="The distance that is added when you increment the distance by one step."
          />
        </label>
        <div className="tabs-dropdown-wrapper">
          <Dropdown selectedOption={this.props.distanceStep}>
            {distances.map(distance => (
              <div
                name={distance.name}
                key={distance.name}
                callback={() =>
                  this.props.modifyScenarioProperty({
                    key: 'distanceStep',
                    value: { name: distance.name, value: distance.value }
                  })
                }
              >
                {distance.name}
              </div>
            ))}
          </Dropdown>
        </div>
        <label className="top">
          Distance{' '}
          <Tooltip
            position="left"
            content="The distance between the primary and the mass you're adding."
          />
        </label>
        <Slider
          payload={{ key: 'distance' }}
          value={this.state.distance}
          callback={this.modifyProperty}
          max={100}
          min={this.props.distanceStep.value}
          step={this.props.distanceStep.value}
        />
        <label className="top">
          Mass
          <Tooltip
            position="left"
            content="The mass of the mass you're adding."
          />
        </label>
        <div className="tabs-dropdown-wrapper">
          <Dropdown>
            {bodies.map(body => (
              <div
                name={body.name}
                key={body.name}
                callback={() =>
                  this.modifyProperty({
                    key: 'm',
                    value: body.m
                  })
                }
              >
                {body.name}
              </div>
            ))}
          </Dropdown>
        </div>
        <Button
          callback={() =>
            this.props.addMass({
              primary: this.props.primary,
              secondary: {
                name: `Custom Mass ${Date.now()}`,
                color: 'limegreen',
                type: 'asteroid',
                m: this.state.m,
                trailVertices: 40000,
                radius: 0.005,
                distance: this.state.distance
              }
            })
          }
        >
          Add Mass
        </Button>
      </div>
    );
  }
}
