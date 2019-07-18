import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Router from './components/Router';

render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.querySelector('#app')
);

if (module.hot) module.hot.accept();
