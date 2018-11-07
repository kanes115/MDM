import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MetricsListElement from '../MetricsListElement';
import SingleServiceMetrics from '../Metrics';

const ServiceMetricsListElement = ({ isExpanded, metrics, toggleServiceExpanded }) => (
  <MetricsListElement
    isExpanded={isExpanded}
    title={_.get(metrics, 'service_name')}
    toggleExpanded={() => toggleServiceExpanded(_.get(metrics, 'service_name'))}
  >
    <SingleServiceMetrics metrics={metrics} />
  </MetricsListElement>
);


ServiceMetricsListElement.propTypes = {
  isExpanded: PropTypes.bool,
  metrics: PropTypes.shape({}).isRequired,
  toggleServiceExpanded: PropTypes.func.isRequired,
};
ServiceMetricsListElement.defaultProps = {
  isExpanded: false,
};

export default ServiceMetricsListElement;
