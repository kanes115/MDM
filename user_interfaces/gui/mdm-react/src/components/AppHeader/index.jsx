import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './app-header.css';

class AppHeader extends Component {
  render() {
    const { activeSystemId, isSystemActive } = this.props;

    return (
      <header className="mdm-header">
        <h1 className="title">MDM</h1>
        <h4 className="subtitle">
          {isSystemActive
            ? (`System: ${activeSystemId}`)
            : ('No active system')
          }
        </h4>
      </header>
    );
  }
}

function mapStateToProps({ jmmsr: { activeSystemId } }) {
  const isSystemActive = activeSystemId.length > 0;

  return {
    activeSystemId,
    isSystemActive,
  };
}

AppHeader.propTypes = {
  activeSystemId: PropTypes.string.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
};
AppHeader.defaultProps = {};

export default connect(mapStateToProps, null)(AppHeader);
