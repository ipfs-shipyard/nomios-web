import React, { Component } from 'react';

import createWallet from 'idm-wallet';
import { CSSTransition } from 'react-transition-group';

import WalletContent from './wallet-content/WalletContent';
import SetupLocker from '../setup-locker/SetupLocker';
import LockScreen from '../lock-screen';

import styles from './Wallet.css';

const lockscreenClassNames = {
    enter: styles.lockscreenEnter,
    enterActive: styles.lockscreenEnterActive,
    exit: styles.lockscreenExit,
    exitActive: styles.lockscreenExitActive,
};

class Wallet extends Component {
    getLock = undefined;

    state = {
        wallet: undefined,
    };

    componentDidMount() {
        createWallet().then((wallet) => {
            wallet.locker.onLockedChange(this.handleLockedChanged);
            this.getLock = wallet.locker.getLock.bind(wallet.locker);

            this.setState({ wallet });
        });
    }

    render() {
        const { wallet } = this.state;

        if (wallet) {
            return this.renderWallet();
        }

        return <div>No Wallet</div>;
    }

    renderWallet = () => {
        const { wallet } = this.state;
        const { locker } = wallet;

        if (locker.isPristine()) {
            return <SetupLocker locker={ locker } onComplete={ this.handleSetupLockerComplete } />;
        }

        const isLocked = locker.isLocked();

        return (
            <div>
                <CSSTransition classNames={ styles.appScreen } in={ isLocked } mountOnEnter unmountOnExit component={ null } timeout={ 2000 }>
                    <LockScreen getLock={ this.getLock } unmounting={ !isLocked } />
                </CSSTransition>
                { !isLocked &&
                    <WalletContent wallet={ wallet } />
                }
            </div>
        );
    };

    unlockWallet = (lockType, challenge) => {
        const { wallet: { locker } } = this.state;

        locker.getLock(lockType).unlock(challenge);
    };

    handleLockedChanged = () => {
        this.forceUpdate();
    };

    handleSetupLockerComplete = () => {
        this.forceUpdate();
    };
}

export default Wallet;
