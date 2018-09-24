import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  setView as setViewAction,
} from '../../../../actions/graph/view';

import ModelGraph from './representation';

class ModelGraphWrapper extends Component {
  render() {
    const {
      definitions,
      setView,
      trafficData,
      view,
    } = this.props;

    return (
      <ModelGraph
        definitions={definitions}
        trafficData={trafficData}
        setView={setView}
        view={view}
      />
    );
  }
}

ModelGraphWrapper.propTypes = {
  setView: PropTypes.func.isRequired,
  trafficData: PropTypes.shape({
    renderer: PropTypes.string,
    name: PropTypes.string,
    entryNode: PropTypes.string,
    nodes: PropTypes.arrayOf(PropTypes.object),
    connections: PropTypes.arrayOf(PropTypes.object),
  }),
};
ModelGraphWrapper.defaultProps = {
  trafficData: null,
};

function mapStateToProps({
  graph: {
    definitions,
    trafficData,
    view,
  },
}) {
  return {
    definitions,
    trafficData,
    view,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setView: newView => dispatch(setViewAction(newView)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelGraphWrapper);
