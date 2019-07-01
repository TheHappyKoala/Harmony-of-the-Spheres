import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Redirect, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
render(React.createElement(Provider, { store: store },
    React.createElement(HashRouter, null,
        React.createElement("div", null,
            React.createElement(Switch, null,
                React.createElement(Redirect, { exact: true, from: "/", to: "scenario/The Sun and the Neptunian System" }),
                React.createElement(Route, { path: "/scenario/:name?", component: App }))))), document.querySelector('#app'));
if (module.hot)
    module.hot.accept();
//# sourceMappingURL=index.js.map