import React, { Component } from 'react';
import Dropdown from '../Dropdown';
import Button from '../Button';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import { getRandomColor } from '../../utils';
import bodies from '../../data/masses';
import maximumDistances from '../../data/distances/maximumDistances';
import distanceSteps from '../../data/distances/distanceSteps';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      m: bodies[0].m,
      radius: bodies[0].radius,
      texture: bodies[0].name,
      type: null,
      distance: props.distanceStep.value
    };
  }

  modifyProperty = payload =>
    this.setState({ ...this.state, [payload.key]: payload.value });

  insertMassTemplate = payload =>
    this.setState({
      ...this.state,
      m: payload.m,
      radius: payload.radius,
      texture: payload.texture,
      color: payload.color,
      type: payload.type
    });

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
          Maximum Distance
          <Tooltip
            position="left"
            content="The maximum allowed distance between the primary and the mass that you are adding."
          />
        </label>
        <div className="tabs-dropdown-wrapper">
          <Dropdown selectedOption={this.props.maximumDistance}>
            {maximumDistances.map(distance => (
              <div
                name={distance.name}
                key={distance.name}
                callback={() =>
                  this.props.modifyScenarioProperty({
                    key: 'maximumDistance',
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
          Distance Step
          <Tooltip
            position="left"
            content="The distance that is added when you increment the distance by one step."
          />
        </label>
        <div className="tabs-dropdown-wrapper">
          <Dropdown selectedOption={this.props.distanceStep}>
            {distanceSteps.map(distance => (
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
          max={this.props.maximumDistance.value}
          min={-this.props.maximumDistance.value}
          shouldUpdateOnMaxMinChange={true}
          onMaxMinChange={{
            payload: {
              key: 'distanceStep',
              value: { name: 'Max distance / 100' }
            },
            callback: this.props.modifyScenarioProperty
          }}
          step={this.props.distanceStep.value}
        />
        <label className="top">
          Mass Template
          <Tooltip
            position="left"
            content="The mass, radius, texture, type and color of the mass you're adding."
          />
        </label>
        <div className="tabs-dropdown-wrapper">
          <Dropdown>
            {bodies.map(body => (
              <div
                name={body.name}
                key={body.name}
                callback={() =>
                  this.insertMassTemplate({
                    m: body.m,
                    radius: body.radius,
                    texture: body.name,
                    type: body.type
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
                trailVertices: 6000,
                m: this.state.m,
                radius: this.state.radius,
                texture: this.state.texture,
                type: this.state.type,
                color: getRandomColor(),
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
