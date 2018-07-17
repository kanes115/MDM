import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {closeForm} from '../../../../actions';

import CreationForm from './representation';

class CreationFormWrapper extends Component {
    render() {
        const {formOpen, formType} = this.props;

        return (
            formOpen && (
                <CreationForm formType={formType}
                              onClose={this.props.closeCreationForm}/>
            )
        );
    }
}

function mapStateToProps({form: {formOpen, formType}}) {
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
    ]),
};
CreationFormWrapper.defaultProps = {
    formType: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreationFormWrapper);
