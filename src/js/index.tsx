import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Redirect, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';

render(
  <Provider store={store}>
    <HashRouter>
      <div>
        <Switch>
          <Redirect
            exact
            from="/"
            to="/category/What-If/scenario/Earth VS. the Rings of Saturn"
          />
          <Route path="/category/:category?/scenario/:name?" component={App} />
        </Switch>
      </div>
    </HashRouter>
  </Provider>,
  document.querySelector('#app')
);

if (module.hot) module.hot.accept();
