import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import WelcomePage from '../../routes/welcome/index';
import ModelPage from '../../routes/model/index';
import DeployPage from '../../routes/deploy/index';
import MonitorPage from '../../routes/monitor/index';

import './app-routes.css';

class AppContent extends Component {
  render() {
    return (
      <div className="mdm-content">
        <Switch>
          <Route exact path="/" component={WelcomePage} />
          <Route path="/model" component={ModelPage} />
          <Route path="/deploy" component={DeployPage} />
          <Route path="/monitor" component={MonitorPage} />
        </Switch>
      </div>
    );
  }
}

AppContent.propTypes = {};
AppContent.defaultProps = {};

export default AppContent;
