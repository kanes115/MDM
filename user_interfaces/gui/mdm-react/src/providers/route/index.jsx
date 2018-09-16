import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import App from '../../routes/index';

class AppRouter extends Component {
  render() {
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  }
}

AppRouter.propTypes = {};
AppRouter.defaultProps = {};

export default AppRouter;
