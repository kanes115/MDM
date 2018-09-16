import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';

import RouteProvider from './route/index';

class AppProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <RouteProvider />
      </Provider>
    );
  }
}

AppProvider.propTypes = {};
AppProvider.defaultProps = {};

export default AppProvider;
