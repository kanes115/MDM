/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

function downloadModel(content, fileName) {
  const a = document.createElement('a');
  const file = new Blob([JSON.stringify(content)], { type: 'application/json' });
  a.href = URL.createObjectURL(file);
  a.download = `${fileName}.json`;
  a.click();
}

class DownloadButton extends Component {
  render() {
    const {
      activeSystem,
      activeSystemId,
      isSystemActive,
    } = this.props;

    return (
      isSystemActive && (
        <li onClick={() => downloadModel(activeSystem, activeSystemId)}>
          <i className="material-icons">get_app</i>
          {' '}
          {'Download model'}
        </li>
      ));
  }
}

DownloadButton.propTypes = {
  activeSystem: PropTypes.shape(),
  activeSystemId: PropTypes.string,
  isSystemActive: PropTypes.bool.isRequired,
};
DownloadButton.defaultProps = {
  activeSystem: {},
  activeSystemId: '',
};

function mapStateToProps({
  jmmsr: {
    activeSystemId,
    systems,
  },
}) {
  const activeSystem = systems[activeSystemId];
  _.set(activeSystem, 'live_metrics', []);

  return {
    activeSystem,
    activeSystemId,
  };
}

export default connect(mapStateToProps)(DownloadButton);
