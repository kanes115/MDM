import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Machine = ({ service }) => (
  <div>
    <div>
      {'Service directory path: '}
      {service.service_dir}
    </div>
    <div>
      {'Service executable path: '}
      {service.service_executable}
    </div>
    <div>
      {'Containerized: '}
      {_.get(service, 'containerized', false)}
    </div>
    <div>
      {'Requirements:'}
      <br />
      {'OS: '}
      {
        (_.get(service, 'requirements.os', []))
          .map(os => `${os} `)
      }
      <br />
      {'RAM: '}
      {_.get(service, 'requirements.RAM', null)}
      <br />
      {'HDD: '}
      {_.get(service, 'requirements.HDD', null)}
      <br />
      {'Machines: '}
      {
        (_.get(service, 'requirements.available_machines', []))
          .map(machine => `${machine} `)
      }
    </div>
  </div>
);

Machine.propTypes = {
  service: PropTypes.shape().isRequired,
};
Machine.defaultProps = {};

export default Machine;
