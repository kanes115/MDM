import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {closeForm} from '../../actions/index';

import CreationForm from './representation/index';

class CreationFormWrapper extends Component {
    render() {
        const {formOpen, formType} = this.props;

        return (
            <CreationForm formOpen={formOpen}
                          formType={formType}
                          onClose={this.props.closeCreationForm}/>
        );
    }
}

function mapStateToProps({ jmmsr: { form: { formOpen, formType } } }) {
    return {
        formOpen,
        formType,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        closeCreationForm: () => dispatch(closeForm()),
    };
}

CreationFormWrapper.propTypes = {
    closeCreationForm: PropTypes.func.isRequired,
    formOpen: PropTypes.bool.isRequired,
    formType: PropTypes.oneOf([
        'connection',
        'machine',
        'service',
        'systemConfig',
        'system',
        '',
    ]),
};
CreationFormWrapper.defaultProps = {
    formType: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(CreationFormWrapper);
