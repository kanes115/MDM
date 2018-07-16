import React from 'react';
import PropTypes from 'prop-types';

import CreationIcon from './CreationIcon';
import CreationPanel from './CreationPanel';

import './creation-button.css';

const CreationButton = ({
                            active,
                            formActive,
                            handleConnectionCreation,
                            handleMachineCreation,
                            handleServiceCreation,
                            toggleCreation
                        }) => (
    !formActive &&
    (<div className="mdm-creation-button">
        {active ?
            (<CreationPanel deactivate={toggleCreation}
                            handleConnectionCreation={handleConnectionCreation}
                            handleMachineCreation={handleMachineCreation}
                            handleServiceCreation={handleServiceCreation}
            />)
            :
            (<CreationIcon activate={toggleCreation}/>)
        }
    </div>)
);

CreationButton.propTypes = {
    active: PropTypes.bool.isRequired,
    formActive: PropTypes.bool.isRequired,
    handleConnectionCreation: PropTypes.func.isRequired,
    handleMachineCreation: PropTypes.func.isRequired,
    handleServiceCreation: PropTypes.func.isRequired,
    toggleCreation: PropTypes.func.isRequired,
};
CreationButton.defaultProps = {};

export default CreationButton;
