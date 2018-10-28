import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ElementField from '../ElementField';

const Machine = ({ machine }) => (
  <div className="element-details">
    <ElementField
      hide={!machine.name}
      label="Name:"
      value={machine.name}
    />
    <ElementField
      hide={!machine.ip}
      label="IP Address:"
      value={machine.ip}
    />
    <ElementField
      hide={!machine.domain}
      label="Domain:"
      value={machine.domain}
    />
    <ElementField
      hide={!machine.ssh_host}
      label="SSH Host:"
      value={machine.ssh_host}
    />
    <ElementField
      hide={!machine.os}
      label="OS:"
      value={machine.os}
    />
    <div className="element-field">
      <span className="key">
        {'Resources:'}
      </span>
      {_.isEmpty(machine.resources) && (
        <span className="value">
          {'Not gathered yet'}
        </span>
      )}
      <ElementField
        hide={_.isEmpty(machine.resources)}
        label="CPU:"
        nested
        value={`${_.get(machine, 'resources.cpu.val')} ${_.get(machine, 'resources.cpu.unit')}`}
      />
      <ElementField
        hide={_.isEmpty(machine.resources)}
        label="Memory:"
        nested
        value={`${_.get(machine, 'resources.mem.val')} ${_.get(machine, 'resources.mem.unit')}`}
      />
    </div>
  </div>
);

Machine.propTypes = {
  machine: PropTypes.shape().isRequired,
};
Machine.defaultProps = {};

export default Machine;
