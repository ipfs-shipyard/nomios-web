import React, { Component } from 'react';
import { Modal, ModalFlow } from '@nomios/web-uikit';
import PropTypes from 'prop-types';

import SetPassphrase from './setup-locker-steps/set-passphrase/SetPassphrase';
import SetTimeout from './setup-locker-steps/set-timeout/SetTimeout';

Modal.setAppElement('#root');

const LOCK_TYPE = 'passphrase';

class SetupLocker extends Component {
    constructor(props) {
        super(props);
        const locker = props.locker;

        this.analyzePasswordQuality = locker.getLock(LOCK_TYPE).validate.bind(locker.getLock(LOCK_TYPE));
        this.enablePassword = locker.getLock(LOCK_TYPE).enable.bind(locker.getLock(LOCK_TYPE));
        this.setMaxTime = locker.getIdleTimer().setMaxTime.bind(locker.getIdleTimer());
    }

    state = {
        stepId: 'passphrase',
        data: {},
    };

    render() {
        const { stepId } = this.state;
        const { isOpen } = this.props;

        return (
            <Modal isOpen={ isOpen }>
                <ModalFlow variant="simple" step={ stepId } closeButton>
                    <SetPassphrase id="passphrase" onNextStep={ this.handleProceedFromPassphrase }
                        analyzePasswordQuality={ this.analyzePasswordQuality } enablePassword={ this.enablePassword } />
                    <SetTimeout id="timeout" onNextStep={ this.handleProceedFromTimeout } setMaxTime={ this.setMaxTime } />
                </ModalFlow>
            </Modal>
        );
    }

    handleProceedFromPassphrase = () => {
        this.setState({ stepId: 'timeout' });
    };

    handleProceedFromTimeout = () => {
        setTimeout(this.props.onComplete, 300);
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
