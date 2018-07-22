import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {openForm} from '../../actions';

import ModelPage from './representation';

class ModelPageWrapper extends Component {
    render() {
        const {isSystemActive} = this.props;

        return (
            <ModelPage isSystemActive={isSystemActive}
                       openSystemCreationForm={this.props.openSystemCreationForm}
            />
        );
    }
}

function mapStateToProps({activeSystemId}) {
    return {
        isSystemActive: activeSystemId.length > 0,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        openSystemCreationForm: () => dispatch(openForm('system')),
    };
}

ModelPageWrapper.propTypes = {
    isSystemActive: PropTypes.bool.isRequired,
    openSystemCreationForm: PropTypes.func.isRequired,
};
ModelPageWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ModelPageWrapper);
