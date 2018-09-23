import React, {Component} from 'react';
import _ from 'lodash';
import Vizceral from 'vizceral-react';

import DetailsPanelConnection from './detailsPanelConnection';
import DetailsPanelNode from './detailsPanelNode';

import './index.css';


const hasOwnPropFunc = Object.prototype.hasOwnProperty;

const panelWidth = 400;

class ModelGraph extends Component {
    constructor (props) {
        super(props);

        this.state = {
            redirectedFrom: undefined,
            selectedChart: undefined,
            displayOptions: {
                allowDraggingOfNodes: true,
                showLabels: true
            },
            currentGraph_physicsOptions: {
                isEnabled: true,
                viscousDragCoefficient: 0.2,
                hooksSprings: {
                    restLength: 50,
                    springConstant: 0.2,
                    dampingConstant: 0.1
                },
                particles: {
                    mass: 1
                }
            },
            labelDimensions: {},
            searchTerm: '',
            matches: {
                total: -1,
                visible: -1
            },
            regionUpdateStatus: [],
            timeOffset: 0,
            modes: {
                detailedNode: 'volume'
            }
        };
    }

    viewChanged = (data) => {
      const {setView} = this.props;

      const changedState = {
        currentView: data.view,
        searchTerm: '',
        matches: {total: -1, visible: -1},
        redirectedFrom: data.redirectedFrom
      };

      if (hasOwnPropFunc.call(data, 'graph')) {
        let oldCurrentGraph = this.state.currentGraph;
        if (oldCurrentGraph == null) oldCurrentGraph = null;
        let newCurrentGraph = data.graph;
        if (newCurrentGraph == null) newCurrentGraph = null;
        if (oldCurrentGraph !== newCurrentGraph) {
          changedState.currentGraph = newCurrentGraph;
          const o = newCurrentGraph === null ? null : newCurrentGraph.getPhysicsOptions();
          changedState.currentGraph_physicsOptions = o;
        }
      }

      setView(changedState);
    };

    viewUpdated = () => {
        this.setState({});
    };

    objectHighlighted = (highlightedObject) => {
      console.log(highlightedObject)
        // need to set objectToHighlight for diffing on the react component. since it was already highlighted here, it will be a noop
        this.setState({
            highlightedObject: highlightedObject, objectToHighlight: highlightedObject ? highlightedObject.getName() : undefined, searchTerm: '', matches: { total: -1, visible: -1 }, redirectedFrom: undefined
        });
    };

    nodeContextSizeChanged = (dimensions) => {
        this.setState({ labelDimensions: dimensions });
    };

    // shouldComponentUpdate (nextProps, nextState) {
    //     if (!this.state.currentView
    //         || this.state.currentView[0] !== nextState.currentView[0]
    //         || this.state.currentView[1] !== nextState.currentView[1]
    //         || this.state.highlightedObject !== nextState.highlightedObject
    //     ) {
    //         const titleArray = (nextState.currentView || []).slice(0);
    //         titleArray.unshift('Vizceral');
    //         document.title = titleArray.join(' / ');
    //
    //         if (this.poppedState) {
    //             this.poppedState = false;
    //         } else if (nextState.currentView) {
    //             const highlightedObjectName = nextState.highlightedObject && nextState.highlightedObject.getName();
    //             const state = {
    //                 title: document.title,
    //                 url: nextState.currentView.join('/') + (highlightedObjectName ? `?highlighted=${highlightedObjectName}` : ''),
    //                 selected: nextState.currentView,
    //                 highlighted: highlightedObjectName
    //             };
    //             window.history.pushState(state, state.title, state.url);
    //         }
    //     }
    //     return true;
    // }

    updateData (newTraffic) {
        const regionUpdateStatus = _.map(
            _.filter(
                newTraffic.nodes, n => n.name !== 'INTERNET'),
                node => ({ region: node.name, updated: node.updated }),
        );
        const lastUpdatedTime = _.max(_.map(regionUpdateStatus, 'updated'));

        this.setState({
            regionUpdateStatus: regionUpdateStatus,
            timeOffset: newTraffic.clientUpdateTime - newTraffic.serverUpdateTime,
            lastUpdatedTime: lastUpdatedTime,
            trafficData: newTraffic
        });
    }

    isSelectedNode () {
      const { view: { currentView } } = this.props;

      return currentView && currentView[1] !== undefined;
    }

    zoomCallback = () => {
        const currentView = _.clone(this.state.currentView);
        if (currentView.length === 1 && this.state.focusedNode) {
            currentView.push(this.state.focusedNode.name);
        } else if (currentView.length === 2) {
            currentView.pop();
        }
        this.setState({ currentView: currentView });
    };

    detailsClosed = () => {
        // If there is a selected node, deselect the node
        if (this.isSelectedNode()) {
            this.setState({ currentView: [this.state.currentView[0]] });
        } else {
            // If there is just a detailed node, remove the detailed node.
            this.setState({ focusedNode: undefined, highlightedObject: undefined });
        }
    };

    matchesFound = (matches) => {
        this.setState({ matches: matches });
    };

    // nodeClicked = (node) => {
    //     if (this.state.currentView.length === 1) {
    //         // highlight node
    //         this.setState({ objectToHighlight: node.getName() });
    //     } else if (this.state.currentView.length === 2) {
    //         // detailed view of node
    //         this.setState({ currentView: [this.state.currentView[0], node.getName()] });
    //     }
    // };

    onNodeClick = (node) => {
        const {
          // onNodeHighlight,
          setDetailedNodeView,
          view,
        } = this.props;
        console.log('!!!onNodeClick', view, node)

      if (view.length === 1) {
        // highlight node
        console.log(1)
        // this.setState({ objectToHighlight: node.getName() });
        // onNodeHighlight(node.getName());
      } else if (view.length === 2) {
        // detailed view of node
        console.log(2)
        // this.setState({ currentView: [this.state.currentView[0], node.getName()] });
        setDetailedNodeView([view[0], node.getName()]);
      }
    };

    render () {
        const globalView = this.state.currentView && this.state.currentView.length === 0;
        const nodeView = !globalView && this.state.currentView && this.state.currentView[1] !== undefined;
        let nodeToShowDetails = this.state.currentGraph && this.state.currentGraph.focusedNode;
        nodeToShowDetails = nodeToShowDetails || (this.state.highlightedObject && this.state.highlightedObject.type === 'node' ? this.state.highlightedObject : undefined);
        const connectionToShowDetails = this.state.highlightedObject && this.state.highlightedObject.type === 'connection' ? this.state.highlightedObject : undefined;

        const { definitions, trafficData, view } = this.props;

        return (
            <div className="vizceral-container">
                <div className="service-traffic-map">
                    <div style={{
                        position: 'absolute',
                        top: '32px',
                        right: '0px',
                        bottom: '0px',
                        left: '240px',
                    }}>
                        <Vizceral traffic={trafficData}
                                  definitions={definitions}
                                  view={view.currentView}
                                  showLabels={this.state.displayOptions.showLabels}
                                  filters={this.state.filters}
                                  viewChanged={this.viewChanged}
                                  viewUpdated={this.viewUpdated}
                                  objectHighlighted={this.objectHighlighted}
                                  nodeContextSizeChanged={this.nodeContextSizeChanged}
                                  objectToHighlight={this.state.objectToHighlight}
                                  matchesFound={this.matchesFound}
                                  match={this.state.searchTerm}
                                  modes={this.state.modes}
                                  allowDraggingOfNodes={this.state.displayOptions.allowDraggingOfNodes}
                                  updateData={this.updateData}
                        />
                    </div>
                    {
                        !!nodeToShowDetails
                        && <DetailsPanelNode node={nodeToShowDetails}
                                             nodeSelected={nodeView}
                                             region={view.currentView[0]}
                                             width={panelWidth}
                                             zoomCallback={this.zoomCallback}
                                             closeCallback={this.detailsClosed}
                                             nodeClicked={node => this.onNodeClick(node)}
                        />
                    }
                    {
                        !!connectionToShowDetails
                        && <DetailsPanelConnection connection={connectionToShowDetails}
                                                   region={view.currentView[0]}
                                                   width={panelWidth}
                                                   closeCallback={this.detailsClosed}
                                                   nodeClicked={node => this.onNodeClick(node)}
                        />
                    }
                </div>
            </div>
        );
    }
}

ModelGraph.propTypes = {};
ModelGraph.defaultProps = {};

export default ModelGraph;
