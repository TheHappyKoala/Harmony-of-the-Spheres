import React, { Fragment, useState } from 'react';
import Tabs from '../Tabs';
import Dropdown from '../Dropdown';
import Button from '../Button';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import bodies from '../../data/masses';

export default props => {
  const [selectedMass, setSelectedMass] = useState(bodies[0].name);

  return (
    <Fragment>
      <h2>Modify Masses</h2>
      <label className="top">
        Mass Being Modified
        <Tooltip
          position="left"
          content="Change the mass being modified. Parameters that you can modify include the mass off the mass and its state vectors."
        />
      </label>
      <Dropdown
        selectedOption={props.massBeingModified}
        dropdownWrapperCssClassName="tabs-dropdown-wrapper"
        selectedOptionCssClassName="selected-option"
        optionsWrapperCssClass="options"
      >
        {props.masses.map(mass => (
          <div
            data-name={mass.name}
            key={mass.name}
            onClick={() =>
              props.modifyScenarioProperty({
                key: 'massBeingModified',
                value: mass.name
              })
            }
          >
            {mass.name}
          </div>
        ))}
      </Dropdown>
      {props.masses.map(
        mass =>
          props.massBeingModified === mass.name && (
            <div key={mass.name}>
              <label className="top">
                Mass
                <Tooltip
                  position="left"
                  content="Modify the mass of the mass being modified."
                />
              </label>
              <Dropdown
                selectedOption={selectedMass}
                dropdownWrapperCssClassName="tabs-dropdown-wrapper"
                selectedOptionCssClassName="selected-option"
                optionsWrapperCssClass="options"
              >
                {bodies.map(body => (
                  <div
                    data-name={body.name}
                    key={body.name}
                    onClick={() => {
                      props.modifyMassProperty({
                        name: mass.name,
                        key: 'm',
                        value: body.m
                      });

                      setSelectedMass(body.name);
                    }}
                  >
                    {body.name}
                  </div>
                ))}
              </Dropdown>
              <Tabs
                tabsWrapperClassName="vector-tabs"
                tabsContentClassName="vector-content"
                initTab={0}
              >
                <div data-label="Position">
                  <label className="top">
                    X Position Vector{' '}
                    <Tooltip
                      position="left"
                      content="Modify the value of the x position vector of the mass being modified."
                    />
                  </label>
                  <Slider
                    payload={{ name: mass.name, key: 'x' }}
                    value={mass.x}
                    callback={props.modifyMassProperty}
                    max={props.distMax}
                    min={props.distMin}
                    step={props.maximumDistance / 20}
                  />
                  <label className="top">
                    Y Position Vector
                    <Tooltip
                      position="left"
                      content="Modify the value of the Y position vector of the mass being modified."
                    />
                  </label>
                  <Slider
                    payload={{ name: mass.name, key: 'y' }}
                    value={mass.y}
                    callback={props.modifyMassProperty}
                    max={props.distMax}
                    min={props.distMin}
                    step={props.maximumDistance / 20}
                  />
                  <label className="top">
                    Z Position Vector
                    <Tooltip
                      position="left"
                      content="Modify the value of the Z position vector of the mass being modified."
                    />
                  </label>
                  <Slider
                    payload={{ name: mass.name, key: 'z' }}
                    property="z"
                    value={mass.z}
                    callback={props.modifyMassProperty}
                    max={props.distMax}
                    min={props.distMin}
                    step={props.maximumDistance / 20}
                  />
                </div>
                <div data-label="Velocity">
                  <label className="top">
                    X Velocity Vector
                    <Tooltip
                      position="left"
                      content="Modify the value of the x velocity vector of the mass being modified."
                    />
                  </label>
                  <Slider
                    payload={{ name: mass.name, key: 'vx' }}
                    value={mass.vx}
                    callback={props.modifyMassProperty}
                    max={props.velMax}
                    min={props.velMin}
                    step={props.velStep}
                  />
                  <label className="top">
                    Y Velocity Vector
                    <Tooltip
                      position="left"
                      content="Modify the value of the y velocity vector of the mass being modified."
                    />
                  </label>
                  <Slider
                    payload={{ name: mass.name, key: 'vy' }}
                    value={mass.vy}
                    callback={props.modifyMassProperty}
                    max={props.velMax}
                    min={props.velMin}
                    step={props.velStep}
                  />
                  <label className="top">
                    Z Velocity Vector
                    <Tooltip
                      position="left"
                      content="Modify the value of the z velocity vector of the mass being modified."
                    />
                  </label>
                  <Slider
                    payload={{ name: mass.name, key: 'vz' }}
                    value={mass.vz}
                    callback={props.modifyMassProperty}
                    max={props.velMax}
                    min={props.velMin}
                    step={props.velStep}
                  />
                </div>
              </Tabs>
              <Button
                callback={() => props.deleteMass(mass.name)}
                cssClassName="button top"
              >
                Delete Mass
              </Button>
            </div>
          )
      )}
    </Fragment>
  );
};
