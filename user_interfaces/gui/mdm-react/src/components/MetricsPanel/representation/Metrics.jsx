import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ElementField from '../../AppDetails/representation/Content/ElementField';

const SingleMetrics = ({ metrics }) => (
  <div className="element-details">
    <ElementField
      hide={!_.get(metrics, 'metrics.cpu.is_ok', true)}
      label="CPU Usage"
      value={`${parseFloat(_.get(metrics, 'metrics.cpu.val', 0)).toFixed(2)} ${_.get(metrics, 'metrics.cpu.unit', '%')}`}
    />
    <ElementField
      hide={!_.get(metrics, 'metrics.mem.is_ok', true)}
      label="Memory Usage"
      value={`${parseFloat(_.get(metrics, 'metrics.mem.val', 0)).toFixed(2)} ${_.get(metrics, 'metrics.mem.unit', '%')}`}
    />
    <ElementField
      hide={!_.get(metrics, 'metrics.net_in.is_ok', true)}
      label="Network in"
      value={`${parseFloat(_.get(metrics, 'metrics.net_in.val', 0)).toFixed(2)} ${_.get(metrics, 'metrics.net_in.unit', 'KB/s')}`}
    />
    <ElementField
      hide={!_.get(metrics, 'metrics.net_out.is_ok', true)}
      label="Network out"
      value={`${parseFloat(_.get(metrics, 'metrics.net_out.val', 0)).toFixed(2)} ${_.get(metrics, 'metrics.net_out.unit', 'KB/s')}`}
    />
  </div>
);

SingleMetrics.propTypes = {
  metrics: PropTypes.shape().isRequired,
};
SingleMetrics.defaultProps = {};

export default SingleMetrics;
