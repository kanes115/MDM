import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DetailsHeader from './Header';
import DetailsStatus from './Status';

import './app-details.css';

class AppDetails extends Component {
  render() {
    const { isModelEmpty } = this.props;

    return (
      <div className="mdm-details">
        <DetailsHeader
          isModelEmpty={isModelEmpty}
        />
        <DetailsStatus />
      </div>
    );
  }
}

AppDetails.propTypes = {
  isModelEmpty: PropTypes.bool.isRequired,
};
AppDetails.defaultProps = {};

export default AppDetails;
