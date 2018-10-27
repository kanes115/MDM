import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DetailsContent from './Content';
import DetailsError from './Error';
// import DetailsHeader from './Header';
import DetailsStatus from './Status';

import './app-details.css';

class AppDetails extends Component {
  render() {
    const {
      activeSystem,
      deploymentError,
      errorOccurred,
      // isModelEmpty,
      onDeleteClick,
      onEditClick,
    } = this.props;

    return (
      <div className="mdm-details">
        <DetailsStatus />
        <DetailsError
          deploymentError={deploymentError}
          errorOccurred={errorOccurred}
        />
        <DetailsContent
          activeSystem={activeSystem}
          onDeleteClick={onDeleteClick}
          onEditClick={onEditClick}
        />
      </div>
    );
  }
}

AppDetails.propTypes = {
  activeSystem: PropTypes.shape({
    config: PropTypes.object,
    connections: PropTypes.array,
    machines: PropTypes.array,
    services: PropTypes.array,
  }),
  deploymentError: PropTypes.shape(),
  errorOccurred: PropTypes.bool,
  // isModelEmpty: PropTypes.bool.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
AppDetails.defaultProps = {
  activeSystem: null,
  deploymentError: null,
  errorOccurred: false,
};

export default AppDetails;
