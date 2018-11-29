import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ElementField from "../ElementField";

const Machine = ({ machineIdToNameMap, service }) => (
  <div className="element-details">
    <ElementField
      hide={!service.name}
      label="Name:"
      value={service.name}
    />
    <ElementField
      hide={!service.service_dir}
      label="Service directory path:"
      value={service.service_dir}
    />
    <ElementField
      hide={!service.service_executable}
      label="Service executable path:"
      value={service.service_executable}
    />
    <ElementField
      hide={!_.get(service, 'containerized', false)}
      label="Containerized"
    />
    <div className="element-field">
      <span className="key">
        {'Requirements:'}
      </span>
      <ElementField
        hide={_.get(service, 'requirements.os', []).length === 0}
        nested
        label="OS:"
        value={
          (_.get(service, 'requirements.os', []))
            .map(os => `${os} `)
        }
      />
      <ElementField
        hide={!_.get(service, 'requirements.RAM', null)}
        nested
        label="RAM:"
        value={_.get(service, 'requirements.RAM')}
      />
      <ElementField
        hide={!_.get(service, 'requirements.HDD', null)}
        nested
        label="HDD:"
        value={_.get(service, 'requirements.HDD')}
      />
      <ElementField
        hide={(_.get(service, 'requirements.available_machines', [])).length === 0}
        nested
        label="Machines:"
        value={_.get(service, 'requirements.available_machines', []).map(machine => `${machineIdToNameMap[machine]} `)}
      />
    </div>
  </div>
);

Machine.propTypes = {
  machineIdToNameMap: PropTypes.shape({}),
  service: PropTypes.shape().isRequired,
};
Machine.defaultProps = {
  machineIdToNameMap: {},
};

export default Machine;
