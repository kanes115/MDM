import React, {Component} from 'react';
import Vizceral from 'vizceral-react';

import './index.css';


const hasOwnPropFunc = Object.prototype.hasOwnProperty;

class ModelGraph extends Component {
    constructor (props) {
        super(props);

        this.state = {
            redirectedFrom: undefined,
            selectedChart: undefined,
            displayOptions: {
                allowDraggingOfNodes: false,
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
      console.log('objectHighlighted', highlightedObject)
    };

    nodeContextSizeChanged = (dimensions) => {
        this.setState({ labelDimensions: dimensions });
    };

    matchesFound = (matches) => {
        this.setState({ matches: matches });
    };

    render () {
        const {
          definitions,
          trafficData,
          view,
        } = this.props;

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
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ModelGraph.propTypes = {};
ModelGraph.defaultProps = {};

export default ModelGraph;
