import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConnectionForm from './representation/index';
import { createNewConnection } from "../../../../actions";

class ConnectionFormWrapper extends Component {
  constructor(props) {
    super(props);

    this.connectionCreationFormAPI = null;
  }

  setFormAPI = (formAPI) => {
    this.connectionCreationFormAPI = formAPI;
  };

  onSubmit = () => {
    const {
      values: {
        service_from,
        service_to,
        port,
      },
    } = this.connectionCreationFormAPI.getState();

    this.props.createConnection({
      service_from,
      service_to,
      port,
    });
  };

  render() {
    const {
      serviceNames,
    } = this.props;

    return (
      <ConnectionForm
        onSubmit={this.onSubmit}
        setFormAPI={this.setFormAPI}
        serviceNames={serviceNames}
      />
    );
  }
}

ConnectionFormWrapper.propTypes = {
  createConnection: PropTypes.func.isRequired,
  serviceNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};
ConnectionFormWrapper.defaultProps = {};

function mapStateToProps({
  jmmsr: {
   systems,
   activeSystemId,
  },
}) {
  const activeSystem = systems[activeSystemId];
  const serviceNames = activeSystem.services.map(service => service.name);

  return {
    serviceNames,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createConnection: (connection) => dispatch(createNewConnection(connection)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionFormWrapper);
