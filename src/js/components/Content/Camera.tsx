import React, { ReactElement, Fragment } from 'react';
import { modifyScenarioProperty } from '../../action-creators/scenario';
import { MassType } from '../../Physics/types';
import Dropdown from '../Dropdown';
import Tooltip from '../Tooltip';

interface CameraProps {
  modifyScenarioProperty: typeof modifyScenarioProperty;
  masses: MassType[];
  rotatingReferenceFrame: string;
  cameraPosition: string;
  cameraFocus: string;
}

export default ({
  modifyScenarioProperty,
  masses,
  rotatingReferenceFrame,
  cameraPosition,
  cameraFocus
}: CameraProps): ReactElement => (
  <Fragment>
    <h2>Camera</h2>
    <label className="top">
      Rotating Reference Frame{' '}
      <Tooltip
        position="left"
        content="Specifying a rotating reference frames allows us to observe the universe unfold relative to a fixed point, for instance Earth. While Earth orbits the Sun regardless of the reference frame being considered, in a rotating reference frame, the sun, for example, will appear to orbit the Earth, which is fixed at the center of the coordinate system."
      />
    </label>
    <Dropdown
      selectedOption={rotatingReferenceFrame}
      dropdownWrapperCssClassName="tabs-dropdown-wrapper"
      selectedOptionCssClassName="selected-option"
      optionsWrapperCssClass="options"
      dynamicChildrenLen={masses.length}
    >
      <div
        data-name="Origo"
        key="Origo"
        onClick={() =>
          modifyScenarioProperty({
            key: 'rotatingReferenceFrame',
            value: 'Origo'
          })
        }
      >
        Origo
      </div>
      <div
        data-name="Barycenter"
        key="Barycenter"
        onClick={() =>
          modifyScenarioProperty({
            key: 'rotatingReferenceFrame',
            value: 'Barycenter'
          })
        }
      >
        Barycenter
      </div>
      {masses.map(mass => (
        <div
          data-name={mass.name}
          key={mass.name}
          onClick={() =>
            modifyScenarioProperty({
              key: 'rotatingReferenceFrame',
              value: mass.name
            })
          }
        >
          {mass.name}
        </div>
      ))}
    </Dropdown>
    <label className="top">
      Camera Position{' '}
      <Tooltip
        position="left"
        content="Select the position of the camera. If the position is set to free, you can zoom in on and orbit around the focus of the camera with your mouse or touch screen."
      />
    </label>
    <Dropdown
      selectedOption={cameraPosition}
      dropdownWrapperCssClassName="tabs-dropdown-wrapper"
      selectedOptionCssClassName="selected-option"
      optionsWrapperCssClass="options"
      dynamicChildrenLen={masses.length}
    >
      <div
        data-name="Free"
        key="Free"
        onClick={() =>
          modifyScenarioProperty({
            key: 'cameraPosition',
            value: 'Free'
          })
        }
      >
        Free
      </div>
      <div
        data-name="Chase"
        key="Chase"
        onClick={() =>
          modifyScenarioProperty({
            key: 'cameraPosition',
            value: 'Chase'
          })
        }
      >
        Chase
      </div>
      {masses.map(mass => (
        <div
          data-name={mass.name}
          key={mass.name}
          onClick={() =>
            modifyScenarioProperty({
              key: 'cameraPosition',
              value: mass.name
            })
          }
        >
          {mass.name}
        </div>
      ))}
    </Dropdown>
    <label className="top">
      Camera Focus{' '}
      <Tooltip
        position="left"
        content="Select the focus of the camera, or in other words, what the camera should be looking at."
      />
    </label>
    <Dropdown
      selectedOption={cameraFocus}
      dropdownWrapperCssClassName="tabs-dropdown-wrapper"
      selectedOptionCssClassName="selected-option"
      optionsWrapperCssClass="options"
      dynamicChildrenLen={masses.length}
    >
      <div
        data-name="Origo"
        key="Origo"
        onClick={() =>
          modifyScenarioProperty({
            key: 'cameraFocus',
            value: 'Origo'
          })
        }
      >
        Origo
      </div>
      <div
        data-name="Barycenter"
        key="Barycenter"
        onClick={() =>
          modifyScenarioProperty({
            key: 'cameraFocus',
            value: 'Barycenter'
          })
        }
      >
        Barycenter
      </div>
      {masses.map(mass => (
        <div
          data-name={mass.name}
          key={mass.name}
          onClick={() =>
            modifyScenarioProperty({
              key: 'cameraFocus',
              value: mass.name
            })
          }
        >
          {mass.name}
        </div>
      ))}
    </Dropdown>
  </Fragment>
);
