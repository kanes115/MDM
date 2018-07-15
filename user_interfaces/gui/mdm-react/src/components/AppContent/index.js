import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './app-content.css';

class AppContent extends Component {
    render() {
        const {children} = this.props;

        return (
            <div className="mdm-content">
                {children}
            </div>
        );
    }
}

AppContent.propTypes = {
    children: PropTypes.element.isRequired,
};
AppContent.defaultProps = {};

export default AppContent;
