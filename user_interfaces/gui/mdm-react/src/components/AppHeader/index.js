import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import './app-header.css';

class AppHeader extends Component {
    render() {
        const {activeSystemId, history, isSystemActive} = this.props;

        return (
            <header className="mdm-header"
                    onClick={() => history.push('/')}>
                <h1 className="title">MDM</h1>
                <h4 className="subtitle">
                    {isSystemActive ?
                        (`System: ${activeSystemId}`)
                        :
                        ('No active system')
                    }
                </h4>
            </header>
        )
    }
}

function mapStateToProps({ jmmsr: { activeSystemId } }) {
    const isSystemActive = activeSystemId.length > 0;

    return {
        activeSystemId,
        isSystemActive,
    };
}

AppHeader.propTypes = {
    activeSystemId: PropTypes.string.isRequired,
    isSystemActive: PropTypes.bool.isRequired,
};
AppHeader.defaultProps = {};

export default withRouter(connect(mapStateToProps, null)(AppHeader));
