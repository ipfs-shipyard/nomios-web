import React, { Component } from 'react';
import { FlowModal, FlowModalStep, setAppElement } from '@nomios/web-uikit';
import PropTypes from 'prop-types';

import SetPassphrase from './setup-locker-steps/set-passphrase/SetPassphrase';
import SetTimeout from './setup-locker-steps/set-timeout/SetTimeout';

setAppElement('#root');

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
            <FlowModal open={ isOpen } variant="simple" step={ stepId } showClose={ false }>
                <FlowModalStep id="passphrase">
                    <SetPassphrase onNextStep={ this.handleProceedFromPassphrase }
                        analyzePasswordQuality={ this.analyzePasswordQuality } enablePassword={ this.enablePassword } />
                </FlowModalStep>
                <FlowModalStep id="timeout">
                    <SetTimeout onNextStep={ this.handleProceedFromTimeout } setMaxTime={ this.setMaxTime } />
                </FlowModalStep>
            </FlowModal>
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
