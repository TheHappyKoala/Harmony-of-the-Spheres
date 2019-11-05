import React, { ReactElement, Fragment, useEffect } from "react";
import { HashRouter, Switch, Redirect, Route } from "react-router-dom";
import App from "../App";
import LoadingScreen from "../LoadingScreen";
import { connect } from "react-redux";
import { AppState } from "../../state/reducers";
import { fetchScenarios } from "../../state/creators/scenarios";

const mapStateToProps = (state: AppState) => ({
  app: state.app
});

const mapDispatchToProps = {
  fetchScenarios: fetchScenarios
};

interface RouterProps {
  app: {
    booted: boolean;
    loading: boolean;
    whatIsLoading: string;
  };
  fetchScenarios: typeof fetchScenarios;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({ app, fetchScenarios }: RouterProps): ReactElement => {
    useEffect(() => {
      fetchScenarios(EXOPLANET_ARCHIVE_DATA);
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
                  to={`/category/${DEFAULT_SCENARIO.type}/scenario/${DEFAULT_SCENARIO.name}`}
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
