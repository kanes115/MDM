import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DetailsContent from './Content';
// import DetailsHeader from './Header';
import DetailsStatus from './Status';

import './app-details.css';

class AppDetails extends Component {
  render() {
    const {
      activeSystem,
      // isModelEmpty,
    } = this.props;

    return (
      <div className="mdm-details">
        <DetailsStatus />
        <DetailsContent
          activeSystem={activeSystem}
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
  isModelEmpty: PropTypes.bool.isRequired,
};
AppDetails.defaultProps = {
  activeSystem: null,
};

export default AppDetails;
