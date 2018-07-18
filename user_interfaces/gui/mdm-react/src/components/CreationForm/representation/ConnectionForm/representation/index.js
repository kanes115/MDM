import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Form} from 'informed';

import {
    FormHeader,
    FormSection,
    InputField,
} from '../../../../FormElements';

import './connection-form.css';

class ConnectionForm extends Component {
    render() {
        const {
            onSubmit,
            selectingSource,
            selectingTarget,
            setFormAPI,
            source,
            target,
            toggleSource,
            toggleTarget,
        } = this.props;

        return (
            <Form id="connection-form"
                  getApi={setFormAPI}>
                {({formState}) =>
                    (<div className="connection-form">
                        <FormHeader title="New connection"/>
                        <FormSection title="Connection details">
                            <InputField id="connection-port"
                                        field="port"
                                        label="Port"
                                        type="number"/>
                            <div className="connection">
                                <div className="connection-side source">
                                    <div className="empty-connection-side"
                                         onClick={toggleSource}>
                                        {_.size(source) > 0 ?
                                            (source.name)
                                            :
                                            (`${selectingSource ? "Choose source" : "Click to select source"}`)
                                        }

                                    </div>
                                </div>
                                <div className="connection-edge"/>
                                <div className="connection-edge-tip"/>
                                <div className="connection-side target">
                                    <div className="empty-connection-side"
                                         onClick={toggleTarget}>
                                        {_.size(target) > 0 ?
                                            (target.name)
                                            :
                                            (`${selectingTarget ? "Choose target" : "Click to select target"}`)
                                        }
                                    </div>
                                </div>
                            </div>
                        </FormSection>

                        <button type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onSubmit();
                                }}>
                            Create connection
                        </button>
                    </div>)
                }
            </Form>
        );
    }
}

ConnectionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    selectingSource: PropTypes.bool.isRequired,
    selectingTarget: PropTypes.bool.isRequired,
    setFormAPI: PropTypes.func.isRequired,
    source: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
    toggleSource: PropTypes.func.isRequired,
    toggleTarget: PropTypes.func.isRequired,
};
ConnectionForm.defaultProps = {};

export default ConnectionForm;
