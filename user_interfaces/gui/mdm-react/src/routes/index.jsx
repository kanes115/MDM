import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './App.css';

import { AppContent, AppHeader, AppNavigation } from '../components/index';
import { initializeWebSocketChannel } from '../actions/websocketActions';

class App extends Component {
  componentDidMount() {
    const { initializeChannel } = this.props;

    initializeChannel();
  }


  render() {
    return (
      <div className="mdm">
        <AppHeader />
        <AppNavigation />
        <AppContent />
      </div>
    );
  }
}

App.propTypes = {
  initializeChannel: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    initializeChannel: () => dispatch(initializeWebSocketChannel()),
  };
}

export default connect(null, mapDispatchToProps)(App);
