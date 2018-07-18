import React from 'react';
import PropTypes from 'prop-types';

import {CloseIcon} from '../../../../../../components';

import './creation-panel.css';

const CreationPanel = ({
                           deactivate,
                           handleConnectionCreation,
                           handleMachineCreation,
                           handleServiceCreation,
                       }) => (
    <div className="panel">
        <CloseIcon onClose={deactivate}/>
        <ul>
            <li onClick={handleMachineCreation}><i className="material-icons">dns</i> Add machine</li>
            <li onClick={handleServiceCreation}><i className="material-icons">category</i> Add service</li>
            <li onClick={handleConnectionCreation}><i className="material-icons">swap_horiz</i> Add connection</li>
        </ul>
    </div>
);

CreationPanel.propTypes = {
    deactivate: PropTypes.func.isRequired,
    handleConnectionCreation: PropTypes.func.isRequired,
    handleMachineCreation: PropTypes.func.isRequired,
    handleServiceCreation: PropTypes.func.isRequired,
};
CreationPanel.defaultProps = {};

export default CreationPanel;