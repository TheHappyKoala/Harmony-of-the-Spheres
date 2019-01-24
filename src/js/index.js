import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Redirect, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
import NoMatchedRoute from './components/NoMatchedRoute'

// Loads the app with the default scenario, "The Sun and the Neptunian System".
// NoMatchedRoute = 404 page
render(
  <Provider store={store}>
    <HashRouter>
      <div>
        <Switch>
          <Redirect
            exact
            from="/"
            to="scenario/The Sun and the Neptunian System"
          />
          <Route path="/scenario/:name?" component={App} />
          <Route component={NoMatchedRoute}/>
        </Switch>
      </div>
    </HashRouter>
  </Provider>,
  document.querySelector('#app')
);

if (module.hot) module.hot.accept();
