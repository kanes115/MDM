import _ from 'lodash';

import * as actionTypes from '../../actions';

const initialState = {
    renderer: 'global',
    name: '',
    entryNode: 'INTERNET',
    nodes: [
        {
            renderer: 'region',
            name: 'INTERNET',
            nodes: [],
            connections: [],
            class: 'normal',
            metadata: {},
        }
    ],
    connections: [],
};

const trafficData = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_NEW_SYSTEM:
            return {
                ...state,
                name: action.payload.systemId,
                updated: Date.now(),
            };
        case actionTypes.CREATE_NEW_MACHINE: {
            const newNodes = [ ...state.nodes ];
            const newConnections = [ ...state.connections ];
            const newMachine = _.get(action, 'payload.machine', {});
            newNodes.push({
                renderer: 'region',
                name: _.get(newMachine, 'name'),
                nodes: [],
                connections: [],
                class: 'warning',
                metadata: {},
                updated: Date.now(),
                // detailedNode: _.cloneDeep(
                //     vizceralUtils.detailedNode.getDefaultDetailedNode()
                // ),
            });
            newConnections.push({
                source: 'INTERNET',
                target: _.get(newMachine, 'name'),
                metrics: {},
                notices: [],
                class: 'normal',
                updated: Date.now(),
            });

            return {
                ...state,
                updated: Date.now(),
                nodes: newNodes,
                connections: newConnections,
            };
        }
        default:
            return state;
    }
};

export default trafficData;
