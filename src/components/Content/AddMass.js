import React, { Component, Fragment } from "react";
import Dropdown from "../Dropdown";
import Button from "../Button";
import Slider from "../Slider";
import Tooltip from "../Tooltip";
import { getRandomColor } from "../../utils";
import Tabs from "../Tabs";
import bodies from "../../masses";

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      m: null,
      radius: null,
      texture: null,
      type: null,
      bodiesWithType: [],
      bodyTypes: []
    };
  }

  componentDidMount() {
    this.setState(
      {
        ...this.state,
        bodiesWithType: bodies.filter(entry => entry.bodyType)
      },
      () => {
        let bodyTypes = [];

        this.state.bodiesWithType.forEach(entry => {
          if (bodyTypes.indexOf(entry.bodyType) === -1)
            bodyTypes = [...bodyTypes, entry.bodyType];
        });

        const [selectedMass] = this.state.bodiesWithType;

        this.setState({
          ...this.state,
          m: selectedMass.m,
          radius: selectedMass.radius,
          texture: selectedMass.name,
          type: selectedMass.massType,
          bodyTypes
        });
      }
    );

    this.props.modifyScenarioProperty({ key: "isMassBeingAdded", value: true });
  }

  componentWillUnmount() {
    this.props.modifyScenarioProperty({
      key: "isMassBeingAdded",
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
      ...payload
    });

  render() {
    return (
      <Fragment>
        <h2>Add Mass</h2>
        {this.props?.masses?.length ? (
          <Fragment>
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
              dynamicChildrenLen={this.props.masses.length}
            >
              <div
                data-name="barycenter"
                key="barycenter"
                onClick={() =>
                  this.props.modifyScenarioProperty(
                    { key: "primary", value: "Barycenter" },
                    { key: "rotatingReferenceFrame", value: "Barycenter" },
                    { key: "cameraPosition", value: "Free" },
                    { key: "cameraFocus", value: "Barycenter" }
                  )
                }
              >
                Barycenter
              </div>
              {this.props.masses.map(mass => (
                <div
                  data-name={mass.name}
                  key={mass.name}
                  onClick={() =>
                    this.props.modifyScenarioProperty(
                      {
                        key: "freeOrigo",
                        value: { x: 0, y: 0, z: mass.radius * 40 }
                      },
                      { key: "primary", value: mass.name },
                      { key: "rotatingReferenceFrame", value: mass.name },
                      { key: "cameraPosition", value: "Free" },
                      { key: "cameraFocus", value: "Origo" }
                    )
                  }
                >
                  {mass.name}
                </div>
              ))}
            </Dropdown>
            <label className="top">
              Semi-major Axis{" "}
              <Tooltip
                position="left"
                content="The semi-major axis, a, is half of the longest diameter of the ellipse the constitutes the shape of the orbit. "
              />
            </label>
            <Slider
              payload={{ key: "a" }}
              value={this.props.a}
              callback={this.props.modifyScenarioProperty}
              max={this.props.maximumDistance}
              min={0}
              shouldUpdateOnMaxMinChange={true}
              step={this.props.maximumDistance / 200}
            />
            <label className="top">
              Eccentricity{" "}
              <Tooltip
                position="left"
                content="The orbital element that determines the shape of the orbit. Bound orbits always have a value between 0 and 1, a value of 0 means the orbit has the shape of a perfect circle."
              />
            </label>
            <Slider
              payload={{ key: "e" }}
              value={this.props.e}
              callback={this.props.modifyScenarioProperty}
              max={1}
              min={0}
              step={0.001}
            />
            <label className="top">
              Argument of Periapsis{" "}
              <Tooltip
                position="left"
                content="The angle, starting from the center of the orbit, between an orbiting body's periapsis, the point in space where it is the closest to the primary it is orbiting, and its ascending node."
              />
            </label>
            <Slider
              payload={{ key: "w" }}
              value={this.props.w}
              callback={this.props.modifyScenarioProperty}
              max={360}
              min={0}
              step={0.1}
            />
            <label className="top">
              Inclination{" "}
              <Tooltip
                position="left"
                content="Orbital inclination is the angle between the plane of an orbit and an arbitrarily defined equator. If a body has an orbital inclination of 90 degrees, orbits from the geographic South to North pole of its primary."
              />
            </label>
            <Slider
              payload={{ key: "i" }}
              value={this.props.i}
              callback={this.props.modifyScenarioProperty}
              max={360}
              min={0}
              step={0.1}
            />
            <label className="top">
              Ascending Node{" "}
              <Tooltip
                position="left"
                content="The ascending node is the angular position at which a celestial body passes from the southern side of an arbitrarily defined reference plane to the northern side."
              />
            </label>
            <Slider
              payload={{ key: "o" }}
              value={this.props.o}
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
              dynamicChildrenLen={this.props.masses.length}
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
                      massType: body.massType,
                      temperature: body.temperature
                    })
                  }
                >
                  {body.name}
                </div>
              ))}
            </Dropdown>
          </Fragment>
        ) : (
          <Fragment>
            <p>Start by adding a star to your simulation.</p>
            <Dropdown
              selectedOption={this.state.texture}
              dropdownWrapperCssClassName="tabs-dropdown-wrapper"
              selectedOptionCssClassName="selected-option"
              optionsWrapperCssClass="options"
              dynamicChildrenLen={this.props.masses?.length}
            >
              {bodies
                .filter(body => body.massType === "star")
                .map(body => (
                  <div
                    data-name={body.name}
                    key={body.name}
                    onClick={() =>
                      this.insertMassTemplate({
                        m: body.m,
                        radius: body.radius,
                        texture: body.name,
                        massType: body.massType,
                        temperature: body.temperature
                      })
                    }
                  >
                    {body.name}
                  </div>
                ))}
            </Dropdown>
          </Fragment>
        )}
        <Button
          callback={() =>
            this.props.addMass({
              primary: this.props.primary,
              secondary: {
                name: `Custom Mass ${Date.now()}`,
                trailVertices: 3000,
                color: getRandomColor(),
                a: this.props.a,
                e: this.props.e,
                w: this.props.w,
                i: this.props.i,
                o: this.props.o,
                x: 0,
                y: 0,
                z: 0,
                vx: 0,
                vy: 0,
                vz: 0,
                activeTab: !this.props.masses.length ? "Vectors" : "Elements",
                customCameraPosition: { x: 0, y: 0, z: 50 },
                ...this.state
              }
            })
          }
          cssClassName="button box top"
        >
          Add {this.state.texture}
        </Button>
      </Fragment>
    );
  }
}
