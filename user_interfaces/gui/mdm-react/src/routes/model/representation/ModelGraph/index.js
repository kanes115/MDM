import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ModelGraph from './representation';

class ModelGraphWrapper extends Component {
    render() {
        const { definitions, trafficData } = this.props;

        return (
            <ModelGraph
                definitions={definitions}
                trafficData={trafficData}
            />
        );
    }
}

ModelGraphWrapper.propTypes = {
    trafficData: PropTypes.shape({
        renderer: PropTypes.string,
        name: PropTypes.string,
        entryNode: PropTypes.string,
        nodes: PropTypes.arrayOf(PropTypes.object),
        connections: PropTypes.arrayOf(PropTypes.object),
    }),
};
ModelGraphWrapper.defaultProps = {};

function mapStateToProps({
    jmmsr,
    graph: {
        definitions,
        trafficData,
    }
}) {
    console.log(definitions, trafficData);

    return {
        definitions,
        trafficData,
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelGraphWrapper);
