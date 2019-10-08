import React, { ReactElement, Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { AppState } from '../../reducers';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import FilterBar from '../FilterBar';
import LazyDog from '../LazyDog';
import Button from '../Button';
import Modal from '../Modal';
import Iframe from '../Iframe';
import './ScenarioNavigation.less';

const mapStateToProps = (
  state: {
    scenarioCategory: string;
    scenarioName: string;
    scenarios: AppState['scenarios'];
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
  scenarios: AppState['scenarios'];
}

export default withRouter(
  connect(mapStateToProps)(
    ({
      scenarioCategory,
      scenarioName,
      scenarios
    }: ScenarioNavigationProps): ReactElement => {
      const [wiki, setWiki] = useState({
        display: false,
        url: ''
      });

      return (
        <Fragment>
          <FilterBar
            selectedOption={scenarioName}
            itemsPerPage={6}
            selectedCategory={scenarioCategory}
            wrapperCssClassName="filter-bar"
            selectedCssClassName="filter-bar-selected"
            resultsCssClass="filter-bar-results"
            dynamicChildrenLen={scenarios.length}
            transition={{
              name: 'left',
              enterTimeout: 150,
              leaveTimeout: 150
            }}
          >
            {scenarios.map(scenario => (
              <div
                className="scenario-navigation-option"
                data-identifier={scenario.type}
              >
                <NavLink
                  to={`/category/${scenario.type}/scenario/${scenario.name}`}
                >
                  <LazyDog
                    src={`./images/scenarios/${scenario.name}.png`}
                    alt={scenario.name}
                    caption={scenario.name}
                    placeHolderIcon="fa fa-venus-mars fa-2x"
                  />
                </NavLink>
                {scenario.scenarioWikiUrl && (
                  <div className="wiki-cta">
                    <Button
                      cssClassName="button"
                      callback={() =>
                        setWiki({
                          ...wiki,
                          display: true,
                          url: scenario.scenarioWikiUrl
                        })
                      }
                    >
                      <i className="fas fa-wikipedia-w fa-2x" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </FilterBar>
          {wiki.display && (
            <Modal callback={() => setWiki({ ...wiki, display: false })}>
              <Iframe url={wiki.url} />
            </Modal>
          )}
        </Fragment>
      );
    }
  )
);
