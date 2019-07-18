import React, { ReactElement, Fragment, useEffect } from 'react';
import { HashRouter, Switch, Redirect, Route } from 'react-router-dom';
import App from '../App';
import LoadingScreen from '../LoadingScreen';
import { connect } from 'react-redux';
import { AppState } from '../../reducers';
import { fetchExoplanetArchiveScenarios } from '../../action-creators/scenarios';

const mapStateToProps = (state: AppState) => ({
  app: state.app
});

const mapDispatchToProps = {
  fetchExoplanetArchiveScenarioss: fetchExoplanetArchiveScenarios
};

interface RouterProps {
  app: {
    booted: boolean;
    loading: boolean;
    whatIsLoading: string;
  };
  fetchExoplanetArchiveScenarioss: typeof fetchExoplanetArchiveScenarios;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ app, fetchExoplanetArchiveScenarioss }: RouterProps): ReactElement => {
    useEffect(() => {
      fetchExoplanetArchiveScenarioss([
        { name: 'Transiting Exoplanet Survey Satellite (TESS)', alias: 'TESS' },
        { name: 'CoRoT', alias: 'CoRoT' }
      ]);
    }, []);

    return (
      <Fragment>
        {app.booted && (
          <HashRouter>
            <div>
              <Switch>
                <Redirect
                  exact
                  from="/"
                  to="/category/What-If/scenario/Earth VS. the Rings of Saturn"
                />
                <Route
                  path="/category/:category?/scenario/:name?"
                  component={App}
                />
              </Switch>
            </div>
          </HashRouter>
        )}
        {app.loading && <LoadingScreen whatIsLoding={app.whatIsLoading} />}
      </Fragment>
    );
  }
);
