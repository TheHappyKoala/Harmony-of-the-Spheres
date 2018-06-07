import React from 'react';
import Dropdown from '../Dropdown';
import Slider from '../Slider';
import './MassInputs.less';

export default function(props) {
  return (
    <div className="mass-inputs">
      <label>Mass Being Modified</label>
      <Dropdown>
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
              <label className="top">X Position Vector</label>
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
              <label className="top">Y Position Vector</label>
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
              <label className="top">Z Position Vector</label>
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
              <label className="top">X Velocity Vector</label>
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
              <label className="top">Y Velocity Vector</label>
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
              <label className="top">Z Velocity Vector</label>
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
            </div>
          )
      )}
    </div>
  );
}
