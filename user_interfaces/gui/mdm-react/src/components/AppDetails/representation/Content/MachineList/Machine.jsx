import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Machine = ({ machine }) => (
  <div>
    <div>
      {'IP Address: '}
      {machine.ip}
    </div>
    <div>
      {'Domain: '}
      {machine.domain}
    </div>
    <div>
      {'SSH Host: '}
      {machine.ssh_host}
    </div>
    <div>
      {'OS: '}
      {machine.os}
    </div>
    {!_.isEmpty(machine.resources) && (
      <div>
        {'Resources:'}
        <br />
        {'CPU: '}
        {`${machine.resources.cpu.val} ${machine.resources.cpu.unit}`}
        <br />
        {'Memory: '}
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
