import React, { Component } from 'react';

// import Content from '../../routes/index';
import Content from '../../routes/model';

import './app-routes.css';

class AppContent extends Component {
  render() {
    return (
      <div className="mdm-content">
        <Content />
      </div>
    );
  }
}

AppContent.propTypes = {};
AppContent.defaultProps = {};

export default AppContent;
