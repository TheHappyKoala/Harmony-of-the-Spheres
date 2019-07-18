import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';
import { scenarios } from './data/scenarios';

export default createStore(
  rootReducer,
  {
    scenarios: [
      ...scenarios,
      ...(JSON.parse(localStorage.getItem('scenarios')) || [])
    ]
  },
  applyMiddleware(thunk)
);
