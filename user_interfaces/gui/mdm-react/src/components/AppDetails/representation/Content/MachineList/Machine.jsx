import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Machine = ({ machine }) => (
  <div>
    <div>
      {machine.ip}
    </div>
    <div>
      {machine.domain}
    </div>
    <div>
      {machine.ssh_host}
    </div>
    <div>
      {machine.os}
    </div>
    {!_.isEmpty(machine.resources) && (
      <div>
        {`${machine.resources.cpu.val} ${machine.resources.cpu.unit}`}
        {' '}
        {`${machine.resources.mem.val} ${machine.resources.mem.unit}`}
      </div>
    )}
  </div>
);

Machine.propTypes = {
  machine: PropTypes.shape().isRequired,
};
Machine.defaultProps = {};

export default Machine;
