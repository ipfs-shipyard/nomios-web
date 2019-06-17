import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { PromiseState } from 'react-promiseful';
import LockScreen from '../../shared/components/lock-screen';
import ErrorScreen from '../../shared/components/error-screen';

class WalletEnclave extends Component {
    state = {
        promise: undefined,
    };

    constructor(props) {
        super(props);

        if (!props.alreadyLoaded) {
            this.state.promise = props.load();
        }
    }

    render() {
        const { locked, unlock, restartIdleTimer, alreadyLoaded, children } = this.props;
        const { promise } = this.state;

        if (alreadyLoaded) {
            return (
                <Fragment>
                    <LockScreen locked={ locked } unlock={ unlock } restartIdleTimer={ restartIdleTimer } />
                    { children }
                </Fragment>
            );
        }

        return (
            <Fragment>
                <LockScreen locked={ locked } unlock={ unlock } restartIdleTimer={ restartIdleTimer } />
                <PromiseState promise={ promise }>
                    { ({ status, value }) => {
                        switch (status) {
                        case 'rejected': return this.renderError(value);
                        case 'fulfilled': return children;
                        default: return null;
                        }
                    } }
                </PromiseState>
            </Fragment>
        );
    }

    renderError(error) {
        return (
            <ErrorScreen
                text="We're having a hard time loading the wallet."
                error={ error }
                onRetry={ this.handleRetry } />
        );
    }

    handleRetry = () => {
        window.location.reload();
    };
}

WalletEnclave.propTypes = {
    locked: PropTypes.bool.isRequired,
    unlock: PropTypes.func.isRequired,
    restartIdleTimer: PropTypes.func.isRequired,
    alreadyLoaded: PropTypes.bool,
    load: PropTypes.func.isRequired,
    children: PropTypes.element,
};

WalletEnclave.defaultProps = {
    children: null,
    alreadyLoaded: true,
};

export default connectIdmWallet((idmWallet) => {
    const alreadyLoaded = idmWallet.identities.isLoaded();
    const load = () => idmWallet.identities.load();
    const restartIdleTimer = () => idmWallet.locker.idleTimer.restartIdleTimer();
    const unlock = async (type, input) => {
        await idmWallet.locker.getLock(type).unlock(input);
        await idmWallet.identities.load().catch(() => {}); // Error is being displayed underneath
    };

    return () => ({
        locked: idmWallet.locker.isLocked(),
        unlock,
        restartIdleTimer,
        alreadyLoaded,
        load,
    });
})(WalletEnclave);
