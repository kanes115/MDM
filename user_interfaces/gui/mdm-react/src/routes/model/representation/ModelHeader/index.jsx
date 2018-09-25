import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { popView } from '../../../../actions/graph/view';

import './model-header.css';

class ModelHeader extends Component {
  render() {
    const { activeSystemName, goBack, view } = this.props;
    const path = _.join([activeSystemName, ...view.currentView], ' / ');

    return (
      <div className="mdm-model-header">
        <i
          className="back material-icons"
          onClick={goBack}
          role="button"
        >
          arrow_back_ios
        </i>
        <div className="mdm-breadcrumbs">
          {path}
        </div>

      </div>
    );
  }
}

ModelHeader.propTypes = {
  activeSystemName: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  view: PropTypes.shape().isRequired,
};
ModelHeader.defaultProps = {};

function mapStateToProps({ jmmsr, graph: { view } }) {
  const { activeSystemId, systems } = jmmsr;
  const activeSystemName = _.get(systems, `${activeSystemId}.name`, '');

  return {
    activeSystemName,
    view,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(popView()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelHeader);
