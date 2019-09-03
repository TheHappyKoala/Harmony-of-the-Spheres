import React, { ReactElement } from 'react';
import { withRouter } from 'react-router-dom';
import { ScenarioProps } from '../../action-types/scenario';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Dropdown from '../Dropdown';
import LazyDog from '../LazyDog';

const mapStateToProps = (
  state: {
    scenarioCategory: string;
    scenarioName: string;
    scenarios: ScenarioProps;
  },
  ownProps: any
) => ({
  scenarioName: ownProps.match.params.name,
  scenarioCategory: ownProps.match.params.category,
  scenarios: state.scenarios
});

interface ScenarioNavigationProps {
  scenarioCategory: string;
  scenarioName: string;
  scenarios: ScenarioProps[];
}

export default withRouter(
  connect(mapStateToProps)(
    ({
      scenarioCategory,
      scenarioName,
      scenarios
    }: ScenarioNavigationProps): ReactElement => (
      <Dropdown
        selectedOption={scenarioName}
        tabs={{
          cssClass: 'tabs',
          activeCssClass: 'active',
          optionsCssClass: 'dropdown-content',
          identifier: 'category',
          selectedCategory: scenarioCategory,
          pagination: {
            itemsPerPage: 12,
            paginationListCssClass: 'dropdown-pagination-list'
          }
        }}
        dropdownWrapperCssClassName="scenario-dropdown-wrapper"
        selectedOptionCssClassName="selected-option"
        optionsWrapperCssClass="scenario-menu box"
        dynamicChildrenLen={scenarios.length}
        transition={{
          name: 'left',
          enterTimeout: 150,
          leaveTimeout: 150
        }}
      >
        {scenarios.map(scenario => (
          <div className="scenario-menu-option" data-identifier={scenario.type}>
            <NavLink
              to={`/category/${scenario.type}/scenario/${scenario.name}`}
            >
              <LazyDog
                src={`./images/scenarios/${scenario.name}.png`}
                alt={scenario.name}
                caption={scenario.name}
                width={159.42028985507247}
                height={100}
                placeHolderIcon="fa fa-venus-mars fa-2x"
              />
            </NavLink>
          </div>
        ))}
      </Dropdown>
    )
  )
);
