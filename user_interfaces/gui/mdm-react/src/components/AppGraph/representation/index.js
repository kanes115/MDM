import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Sigma, RandomizeNodePositions, RelativeSize} from 'react-sigma';

class AppGraph extends Component {
    render() {
        const {graph} = this.props;
        console.log(graph)

        return (
            <Sigma graph={graph}
                   settings={{drawEdges: true, clone: false}}
            >
                <RelativeSize initialSize={30}/>
                <RandomizeNodePositions/>
            </Sigma>
        );
    }
}

AppGraph.propTypes = {
    graph: PropTypes.shape({
        nodes: PropTypes.arrayOf(PropTypes.object),
        edges: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
};
AppGraph.defaultProps = {};

export default AppGraph;
