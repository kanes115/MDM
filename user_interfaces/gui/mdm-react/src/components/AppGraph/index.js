import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import AppGraph from './representation';

class AppGraphWrapper extends Component {
    render() {
        const {graph} = this.props;

        return (
            <AppGraph graph={graph}/>
        );
    }
}

function mapStateToProps({graph}) {
    return {
        graph,
    };
}

AppGraphWrapper.propTypes = {
    graph: PropTypes.shape({
        nodes: PropTypes.arrayOf(PropTypes.object),
        edges: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
};
AppGraphWrapper.defaultProps = {};

export default connect(mapStateToProps)(AppGraphWrapper);
