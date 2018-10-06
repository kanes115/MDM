import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class AppDetailsStatus extends Component {
  getStatus = () => {
    const {
      deployment: {
        dataGathered,
        deployed,
        deploying,
        gatheringData,
      },
    } = this.props;

    if (gatheringData) {
      return 'gathering data';
    }
    if (dataGathered && deployed) {
      return 'deployed, monitoring';
    }
    if (dataGathered && deploying) {
      return 'deploying';
    }
    if (dataGathered) {
      return 'data gathered, ready to deploy';
    }
    return 'modelling';
  };

  render() {
    return (
      <div>
        <h2>
          {'Status: '}
          {this.getStatus()}
        </h2>
      </div>
    );
  }
}

AppDetailsStatus.propTypes = {
  deployment: PropTypes.shape({
    dataGathered: PropTypes.bool,
    deployed: PropTypes.bool,
    deploying: PropTypes.bool,
    gatheringData: PropTypes.bool,
  }).isRequired,
};
AppDetailsStatus.defaultProps = {};

function mapStateToProps({ graph: { deployment } }) {
  return {
    deployment,
  };
}

export default connect(mapStateToProps)(AppDetailsStatus);
