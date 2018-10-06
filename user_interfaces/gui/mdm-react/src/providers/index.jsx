import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';

import App from '../routes';

class AppProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppProvider.propTypes = {};
AppProvider.defaultProps = {};

export default AppProvider;
