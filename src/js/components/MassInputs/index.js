import React from 'react';
import Dropdown from '../Dropdown';
import Slider from '../Slider';
import Button from '../Button';
import Tooltip from '../Tooltip';
import bodies from '../../data/masses';
import './MassInputs.less';

export default function(props) {
  return (
    <div className="mass-inputs">
      <label>
        Mass Being Modified
        <Tooltip
          position="left"
          content="Change the mass being modified. Parameters that you can modify include the mass off the mass and its state vectors."
        />
      </label>
      <Dropdown selectedOption={props.scenario.massBeingModified}>
        {props.scenario.masses.map(mass => (
          <div
            name={mass.name}
            key={mass.name}
            callback={() =>
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
      {props.scenario.masses.map(
        mass =>
          props.scenario.massBeingModified === mass.name && (
            <div key={mass.name}>
              <label className="top">
                Mass
                <Tooltip
                  position="left"
                  content="Modify the mass of the mass being modified."
                />
              </label>
              <Dropdown>
                {bodies.map(body => (
                  <div
                    name={body.name}
                    key={body.name}
                    callback={() =>
                      props.modifyMassProperty({
                        name: mass.name,
                        key: 'm',
                        value: body.m
                      })
                    }
                  >
                    {body.name}
                  </div>
                ))}
              </Dropdown>
              <label className="top">
                X Position Vector{' '}
                <Tooltip
                  position="left"
                  content="Modify the value of the x position vector of the mass being modified."
                />
              </label>
              <Slider
                val={mass.x}
                callback={e =>
                  props.modifyMassProperty({
                    name: mass.name,
                    key: 'x',
                    value: parseFloat(e.target.value)
                  })
                }
                max={props.scenario.distMax}
                min={props.scenario.distMin}
                step={props.scenario.distStep}
              />
              <label className="top">
                Y Position Vector
                <Tooltip
                  position="left"
                  content="Modify the value of the Y position vector of the mass being modified."
                />
              </label>
              <Slider
                val={mass.y}
                callback={e =>
                  props.modifyMassProperty({
                    name: mass.name,
                    key: 'y',
                    value: parseFloat(e.target.value)
                  })
                }
                max={props.scenario.distMax}
                min={props.scenario.distMin}
                step={props.scenario.distStep}
              />
              <label className="top">
                Z Position Vector
                <Tooltip
                  position="left"
                  content="Modify the value of the Z position vector of the mass being modified."
                />
              </label>
              <Slider
                val={mass.z}
                callback={e =>
                  props.modifyMassProperty({
                    name: mass.name,
                    key: 'z',
                    value: parseFloat(e.target.value)
                  })
                }
                max={props.scenario.distMax}
                min={props.scenario.distMin}
                step={props.scenario.distStep}
              />
              <label className="top">
                X Velocity Vector
                <Tooltip
                  position="left"
                  content="Modify the value of the x velocity vector of the mass being modified."
                />
              </label>
              <Slider
                val={mass.vx}
                callback={e =>
                  props.modifyMassProperty({
                    name: mass.name,
                    key: 'vx',
                    value: parseFloat(e.target.value)
                  })
                }
                max={props.scenario.velMax}
                min={props.scenario.velMin}
                step={props.scenario.velStep}
              />
              <label className="top">
                Y Velocity Vector
                <Tooltip
                  position="left"
                  content="Modify the value of the y velocity vector of the mass being modified."
                />
              </label>
              <Slider
                val={mass.vy}
                callback={e =>
                  props.modifyMassProperty({
                    name: mass.name,
                    key: 'vy',
                    value: parseFloat(e.target.value)
                  })
                }
                max={props.scenario.velMax}
                min={props.scenario.velMin}
                step={props.scenario.velStep}
              />
              <label className="top">
                Z Velocity Vector
                <Tooltip
                  position="left"
                  content="Modify the value of the z velocity vector of the mass being modified."
                />
              </label>
              <Slider
                val={mass.vz}
                callback={e =>
                  props.modifyMassProperty({
                    name: mass.name,
                    key: 'vz',
                    value: parseFloat(e.target.value)
                  })
                }
                max={props.scenario.velMax}
                min={props.scenario.velMin}
                step={props.scenario.velStep}
              />
              <Button callback={() => props.deleteMass(mass.name)}>
                Delete Mass
              </Button>
            </div>
          )
      )}
    </div>
  );
}
