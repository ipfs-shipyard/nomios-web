import React, { Component } from 'react';
import { FlowModal, FlowModalStep } from '@nomios/web-uikit';
import PropTypes from 'prop-types';
import SetPassphrase from './steps/set-passphrase/SetPassphrase';
import SetIdleTimer from './steps/set-idle-timer/SetIdleTimer';

const LOCK_TYPE = 'passphrase';

class SetupLocker extends Component {
    constructor(props) {
        super(props);
        const locker = props.locker;

        this.analyzePasswordQuality = locker.getLock(LOCK_TYPE).validate.bind(locker.getLock(LOCK_TYPE));
        this.enablePassphrase = locker.getLock(LOCK_TYPE).enable.bind(locker.getLock(LOCK_TYPE));
        this.setMaxTime = locker.idleTimer.setMaxTime.bind(locker.idleTimer);
    }

    state = {
        stepId: 'passphrase',
        data: {},
    };

    componentWillUnmount() {
        clearTimeout(this.onCompleteTimeout);
    }

    render() {
        const { stepId } = this.state;
        const { locker, onComplete, ...rest } = this.props;

        return (
            <FlowModal { ...rest } variant="simple" step={ stepId } showClose={ false }>
                <FlowModalStep id="passphrase">
                    <SetPassphrase
                        onNextStep={ this.handleProceedFromPassphrase }
                        validatePassphrase={ this.analyzePasswordQuality }
                        enablePassphrase={ this.enablePassphrase } />
                </FlowModalStep>
                <FlowModalStep id="timeout">
                    <SetIdleTimer onNextStep={ this.handleProceedFromTimeout } setMaxTime={ this.setMaxTime } />
                </FlowModalStep>
            </FlowModal>
        );
    }

    handleProceedFromPassphrase = () => {
        this.setState({ stepId: 'timeout' });
    };

    handleProceedFromTimeout = () => {
        this.onCompleteTimeout = setTimeout(this.props.onComplete, 300);
    };
}

SetupLocker.propTypes = {
    locker: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default SetupLocker;
