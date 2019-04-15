import React, { Component } from 'react';
import { Modal, ModalFlow } from '@nomios/web-uikit';
import PropTypes from 'prop-types';
import setupLockerSteps from './setup-locker-steps';
import { injectPropsIntoStepArray } from '../../utils/utils.js';

Modal.setAppElement('#root');

const LOCK_TYPE = 'passphrase';

class SetupLocker extends Component {
    constructor(props) {
        super(props);
        const locker = props.locker;

        this.setupLockerSteps = injectPropsIntoStepArray(setupLockerSteps, 'passphrase',
            { analyzePasswordQuality: locker.getLock(LOCK_TYPE).validate.bind(locker.getLock(LOCK_TYPE)),
                enablePassword: locker.getLock(LOCK_TYPE).enable.bind(locker.getLock(LOCK_TYPE)) });
        this.setupLockerSteps = injectPropsIntoStepArray(this.setupLockerSteps, 'timeout',
            { setMaxTime: locker.getIdleTimer().setMaxTime.bind(locker.getIdleTimer()) });
    }

    state = {
        stepId: 'passphrase',
        feedback: 'none',
    };

    render() {
        const { stepId, feedback } = this.state;
        const { isOpen } = this.props;

        return (
            <Modal isOpen={ isOpen }>
                <ModalFlow variant="simple" step={ stepId } closeButton>
                    { this.setupLockerSteps.map(({ component: Step, props }, index) => (
                        <Step { ...props } key={ index }
                            onNextStep={ this.handleNextStep(props.nextStepId) } feedback={ feedback } />
                    )) }
                </ModalFlow>
            </Modal>
        );
    }

    handleNextStep = (data, nextStepId) => {
        if (nextStepId != null) {
            this.setState({ stepId: nextStepId });
        } else {
            setTimeout(this.props.onComplete, 300);
            // this.handleSubmission(newData);
        }
    };
}

SetupLocker.propTypes = {
    locker: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
};

SetupLocker.defaultProps = {
    isOpen: false,
};

export default SetupLocker;
