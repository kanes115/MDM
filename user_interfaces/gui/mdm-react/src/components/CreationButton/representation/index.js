import React from 'react';
import PropTypes from 'prop-types';

import CreationIcon from './CreationIcon/index';
import CreationPanel from './CreationPanel/index';

import './creation-button.css';

const CreationButton = ({
                            active,
                            formActive,
                            handleConnectionCreation,
                            handleMachineCreation,
                            handleServiceCreation,
                            handleSystemConfiguration,
                            handleSystemCreation,
                            isSystemActive,
                            toggleCreation,
                        }) => (
    !formActive &&
    (<div className="mdm-creation-button">
        {active ?
            (<CreationPanel deactivate={toggleCreation}
                            handleConnectionCreation={handleConnectionCreation}
                            handleMachineCreation={handleMachineCreation}
                            handleServiceCreation={handleServiceCreation}
                            handleSystemConfiguration={handleSystemConfiguration}
                            handleSystemCreation={handleSystemCreation}
                            isSystemActive={isSystemActive}
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
    handleSystemConfiguration: PropTypes.func.isRequired,
    handleSystemCreation: PropTypes.func.isRequired,
    isSystemActive: PropTypes.bool.isRequired,
    toggleCreation: PropTypes.func.isRequired,
};
CreationButton.defaultProps = {};

export default CreationButton;
