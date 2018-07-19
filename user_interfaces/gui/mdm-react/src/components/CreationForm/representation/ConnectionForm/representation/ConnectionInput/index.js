import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './connection-input.css';

const ConnectionInput = ({
                             selectingSource,
                             selectingTarget,
                             source,
                             target,
                             toggleSource,
                             toggleTarget,
                         }) => (
    <div className="connection">
        <div className="connection-side source">
            {_.size(source) > 0 ?
                (<div className="service-connection-side">
                    {source.name}
                </div>)
                :
                (<div className="empty-connection-side"
                      onClick={toggleSource}>
                    {`${selectingSource ? "Choose source" : "Click to select source"}`}
                </div>)
            }
        </div>
        <div className="connection-edge"/>
        <div className="connection-edge-tip"/>
        <div className="connection-side target">
            {_.size(target) > 0 ?
                (<div className="service-connection-side">
                    {target.name}
                </div>)
                :
                (<div className="empty-connection-side"
                      onClick={toggleTarget}>
                    {`${selectingTarget ? "Choose target" : "Click to select target"}`}
                </div>)
            }
        </div>
    </div>
);

ConnectionInput.propTypes = {
    selectingSource: PropTypes.bool.isRequired,
    selectingTarget: PropTypes.bool.isRequired,
    source: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
    toggleSource: PropTypes.func.isRequired,
    toggleTarget: PropTypes.func.isRequired,
};
ConnectionInput.defaultProps = {};

export default ConnectionInput;
