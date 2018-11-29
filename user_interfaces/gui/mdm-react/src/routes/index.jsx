import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './App.css';

import { AppContent, AppHeader, AppNavigation } from '../components/index';
import { initializeWebSocketChannel } from '../actions/websocketActions';

import { EmptyState } from '../components';

class App extends Component {
  componentDidMount() {
    const { initializeChannel } = this.props;

    initializeChannel();
  }


  render() {
    const { downloadingSystem } = this.props;

    return (
      <div className="mdm">
        {downloadingSystem && (
          <div className="overlay">
            <div className="loader">
              <EmptyState iconName="hourglass_empty">
                {'Connecting to pilot...'}
              </EmptyState>
            </div>
          </div>
        )}
        <AppHeader />
        <AppNavigation />
        <AppContent />
      </div>
    );
  }
}

App.propTypes = {
  downloadingSystem: PropTypes.bool.isRequired,
  initializeChannel: PropTypes.func.isRequired,
};

function mapStateToProps({ jmmsr: { downloadingSystem } }) {
  return {
    downloadingSystem,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initializeChannel: () => dispatch(initializeWebSocketChannel()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
