import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _ from 'lodash';

import {openForm} from '../../actions';
import {CreationButton, CreationForm, EmptyState} from '../../components';

import './welcome.css';

class WelcomePage extends Component {
    openForm = () => {
        this.props.openCreationForm('system');
    };

    render() {
        const {hasSystems, systems} = this.props;

        return (
            <div className="welcome">
                {hasSystems ?
                    (_.map(systems, (system, systemName) => (
                        <div key={systemName}>
                            {systemName}
                        </div>
                    )))
                    :
                    (<EmptyState iconName="device_hub">
                        <div>There are no systems yet</div>
                        <div>
                            Start by <span className="action" onClick={this.openForm}>creating new system</span>
                        </div>
                    </EmptyState>)
                }
                <CreationButton/>
                <CreationForm/>
            </div>
        );
    }
}

function mapStateToProps({systems}) {
    const hasSystems = _.size(systems) > 0;

    return {
        hasSystems,
        systems,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        openCreationForm: (formType) => dispatch(openForm(formType)),
    };
}

WelcomePage.propTypes = {
    hasSystems: PropTypes.bool.isRequired,
    openCreationForm: PropTypes.func.isRequired,
    systems: PropTypes.object,
};
WelcomePage.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
