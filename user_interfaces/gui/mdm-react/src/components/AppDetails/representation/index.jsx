import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DetailsHeader from './Header';

import './app-details.css';

class AppDetails extends Component {
  render() {
    return (
      <div className="mdm-details">
        <DetailsHeader />
      </div>
    );
  }
}

AppDetails.propTypes = {};
AppDetails.defaultProps = {};

export default AppDetails;
