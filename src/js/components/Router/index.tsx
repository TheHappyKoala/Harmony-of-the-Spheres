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
  fetchExoplanetArchiveScenarios: fetchExoplanetArchiveScenarios
};

interface RouterProps {
  app: {
    booted: boolean;
    loading: boolean;
    whatIsLoading: string;
  };
  fetchExoplanetArchiveScenarios: typeof fetchExoplanetArchiveScenarios;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ app, fetchExoplanetArchiveScenarios }: RouterProps): ReactElement => {
    useEffect(() => {
      fetchExoplanetArchiveScenarios(EXOPLANET_ARCHIVE_DATA);
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
                  to={`/category/What-If/scenario/${DEFAULT_SCENARIO}`}
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
