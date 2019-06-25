import React, { Component, Fragment } from 'react';
import Dropdown from '../Dropdown';
import Button from '../Button';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import { getRandomColor } from '../../utils';
import bodies from '../../data/masses';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      m: bodies[0].m,
      radius: bodies[0].radius,
      texture: bodies[0].name,
      type: null
    };
  }

  componentDidMount() {
    this.props.modifyScenarioProperty({ key: 'isMassBeingAdded', value: true });
  }

  componentWillUnmount() {
    this.props.modifyScenarioProperty({
      key: 'isMassBeingAdded',
      value: false
    });
  }

  modifyProperty = payload => {
    this.setState(prevState => ({
      ...prevState,
      [payload.key]: payload.value
    }));
  };

  insertMassTemplate = payload =>
    this.setState({
      ...this.state,
      m: payload.m,
      radius: payload.radius,
      texture: payload.texture,
      type: payload.type
    });

  render() {
    return (
      <Fragment>
        <h2>Add Mass</h2>
        <label className="top">
          Primary
          <Tooltip
            position="left"
            content="The celestial object you want your mass to orbit."
          />
        </label>
        <Dropdown
          selectedOption={this.props.primary}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
        >
          {this.props.masses.map(mass => (
            <div
              data-name={mass.name}
              key={mass.name}
              onClick={() =>
                this.props.modifyScenarioProperty(
                  {
                    key: 'freeOrigo',
                    value: { x: 0, y: 0, z: mass.radius * 40 }
                  },
                  { key: 'primary', value: mass.name },
                  { key: 'rotatingReferenceFrame', value: mass.name },
                  { key: 'cameraPosition', value: 'Free' },
                  { key: 'cameraFocus', value: 'Origo' }
                )
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
        <label className="top">
          Semi-major Axis{' '}
          <Tooltip
            position="left"
            content="Either of two points on the orbit of a planet or satellite that are nearest to or furthest from the body round which it moves. If apsis one is equal to apsis two you get the special case of a circular orbit."
          />
        </label>
        <Slider
          payload={{ key: 'a' }}
          value={this.props.a}
          callback={this.props.modifyScenarioProperty}
          max={this.props.maximumDistance}
          min={0}
          shouldUpdateOnMaxMinChange={true}
          step={this.props.maximumDistance / 200}
        />
        <label className="top">
          Eccentricity{' '}
          <Tooltip
            position="left"
            content="The argument of periapsis, w, is one of the orbital elements of an orbiting body. Parametrically, w is the angle from the mass's ascending node to its periapsis, the point in its orbit where the mass is the closest to the body it orbits, measured in the direction of motion."
          />
        </label>
        <Slider
          payload={{ key: 'e' }}
          value={this.props.e}
          callback={this.props.modifyScenarioProperty}
          max={1}
          min={0}
          step={0.001}
        />
        <label className="top">
          Argument of Periapsis{' '}
          <Tooltip
            position="left"
            content="The argument of periapsis, w, is one of the orbital elements of an orbiting body. Parametrically, w is the angle from the mass's ascending node to its periapsis, the point in its orbit where the mass is the closest to the body it orbits, measured in the direction of motion."
          />
        </label>
        <Slider
          payload={{ key: 'w' }}
          value={this.props.w}
          callback={this.props.modifyScenarioProperty}
          max={360}
          min={0}
          step={0.1}
        />
        <label className="top">
          Inclination{' '}
          <Tooltip
            position="left"
            content="Orbital inclination, i, measures the tilt of an object's orbit around a celestial body. It is expressed as the angle between a reference plane and the orbital plane or axis of direction of the orbiting object."
          />
        </label>
        <Slider
          payload={{ key: 'i' }}
          value={this.props.i}
          callback={this.props.modifyScenarioProperty}
          max={360}
          min={0}
          step={0.1}
        />
        <label className="top">
          Mass Template
          <Tooltip
            position="left"
            content="The mass, radius, texture, type and color of the mass you're adding."
          />
        </label>
        <Dropdown
          selectedOption={this.state.texture}
          dropdownWrapperCssClassName="tabs-dropdown-wrapper"
          selectedOptionCssClassName="selected-option"
          optionsWrapperCssClass="options"
        >
          {bodies.map(body => (
            <div
              data-name={body.name}
              key={body.name}
              onClick={() =>
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
        <Button
          callback={() =>
            this.props.addMass({
              primary: this.props.primary,
              secondary: {
                name: `Custom Mass ${Date.now()}`,
                trailVertices: 9000,
                m: this.state.m,
                radius: this.state.radius,
                texture: this.state.texture,
                type: this.state.type,
                color: getRandomColor(),
                a: this.props.a,
                e: this.props.e,
                w: this.props.w,
                i: this.props.i
              }
            })
          }
          cssClassName="button top"
        >
          Add Mass
        </Button>
      </Fragment>
    );
  }
}
