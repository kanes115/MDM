import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ListElement from './ListElement';

class ServiceMetrics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: {},
    };
  }

  toggleServiceExpanded = (id) => {
    this.setState(prevState => ({
      expanded: {
        ...prevState.expanded,
        [id]: !prevState.expanded[id],
      },
    }));
  };

  render() {
    const { metrics } = this.props;
    const { expanded } = this.state;

    return (
      <div className="mdm-metrics-list">
        <h3>
          {'Service metrics'}
        </h3>
        <ul className="element-list">
          {metrics.map(serviceMetrics => (
            <ListElement
              key={_.get(serviceMetrics, 'service_name')}
              isExpanded={expanded[_.get(serviceMetrics, 'service_name')]}
              metrics={serviceMetrics}
              toggleServiceExpanded={this.toggleServiceExpanded}
            />
          ))}
        </ul>
      </div>
    );
  }
}

ServiceMetrics.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.shape()),
};
ServiceMetrics.defaultProps = {
  metrics: [],
};

export default ServiceMetrics;
