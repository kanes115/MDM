import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ElementField from '../../AppDetails/representation/Content/ElementField';

const SingleMetrics = ({ metrics }) => (
  <div className="element-details">
    <ElementField
      label="Status"
      value={_.get(metrics, 'is_down', false) ? 'Down' : 'Up'}
    />
    <ElementField
      label="Exit Status"
      hide={!_.get(metrics, 'exit_status', null)}
      value={_.get(metrics, 'exit_status.value', null)}
    />
    <ElementField
      hide={!_.get(metrics, 'metrics.cpu.is_ok', true) || _.get(metrics, 'is_down', false)}
      label="CPU Usage"
      value={`${parseFloat(_.get(metrics, 'metrics.cpu.val', 0)).toFixed(2)} ${_.get(metrics, 'metrics.cpu.unit', '%')}`}
    />
    <ElementField
      hide={!_.get(metrics, 'metrics.mem.is_ok', true) || _.get(metrics, 'is_down', false)}
      label="Memory Usage"
      value={`${parseFloat(_.get(metrics, 'metrics.mem.val', 0)).toFixed(2)} ${_.get(metrics, 'metrics.mem.unit', '%')}`}
    />
    <ElementField
      hide={!_.get(metrics, 'metrics.net_in.is_ok', true) || _.get(metrics, 'is_down', false)}
      label="Network in"
      value={`${parseFloat(_.get(metrics, 'metrics.net_in.val', 0)).toFixed(2)} ${_.get(metrics, 'metrics.net_in.unit', 'KB/s')}`}
    />
    <ElementField
      hide={!_.get(metrics, 'metrics.net_out.is_ok', true) || _.get(metrics, 'is_down', false)}
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
