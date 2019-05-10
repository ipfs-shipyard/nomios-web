import React, { Component } from 'react';
import { FlowModal, FlowModalStep } from '@nomios/web-uikit';
import { connectIdmWallet } from 'react-idm-wallet';
import PropTypes from 'prop-types';
import SetPassphrase from './steps/set-passphrase';
import SetIdleTimer from './steps/set-idle-timer';

class SetupLocker extends Component {
    state = {
        stepId: 'passphrase',
        data: {},
    };

    componentWillUnmount() {
        clearTimeout(this.onCompleteTimeout);
    }

    render() {
        const { stepId } = this.state;
        const { enablePassphrase, validatePassphrase, setMaxTime, onComplete, ...rest } = this.props;

        return (
            <FlowModal { ...rest } variant="simple" step={ stepId } showClose={ false }>
                <FlowModalStep id="passphrase">
                    <SetPassphrase
                        onNextStep={ this.handleProceedFromPassphrase }
                        validatePassphrase={ validatePassphrase }
                        enablePassphrase={ enablePassphrase } />
                </FlowModalStep>
                <FlowModalStep id="timeout">
                    <SetIdleTimer onNextStep={ this.handleProceedIdleTimer } setMaxTime={ setMaxTime } />
                </FlowModalStep>
            </FlowModal>
        );
    }

    handleProceedFromPassphrase = () => {
        this.setState({ stepId: 'timeout' });
    };

    handleProceedIdleTimer = () => {
        this.props.onComplete();
    };
}

SetupLocker.propTypes = {
    open: PropTypes.bool,
    enablePassphrase: PropTypes.func.isRequired,
    validatePassphrase: PropTypes.func.isRequired,
    setMaxTime: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default connectIdmWallet((idmWallet) => {
    const enablePassphrase = (input) => idmWallet.locker.getLock('passphrase').enable(input);
    const validatePassphrase = (input) => idmWallet.locker.getLock('passphrase').validate(input);
    const setMaxTime = (value) => idmWallet.locker.idleTimer.setMaxTime(value);

    return () => ({
        enablePassphrase,
        validatePassphrase,
        setMaxTime,
    });
})(SetupLocker);
