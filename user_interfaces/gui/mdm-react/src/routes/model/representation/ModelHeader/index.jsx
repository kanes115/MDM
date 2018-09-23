import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { popView } from '../../../../actions/graph/view';

import './model-header.css';

class ModelHeader extends Component {
  render() {
    const { goBack, view } = this.props;
    const path = _.join(view.currentView, ' / ');

    return (
      <div className="mdm-model-header">
        <i
          className="material-icons"
          onClick={goBack}
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
  goBack: PropTypes.func.isRequired,
  view: PropTypes.shape().isRequired,
};
ModelHeader.defaultProps = {};

function mapStateToProps({ graph: { view } }) {
  // console.log('! view', view)

  return {
    view,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(popView()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelHeader);
