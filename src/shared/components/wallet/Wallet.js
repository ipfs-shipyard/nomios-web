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
        isPristine: true,
    };

    componentDidMount() {
        createWallet().then((wallet) => {
            wallet.locker.onLockedChange(this.handleLockedChanged);
            this.getLock = wallet.locker.getLock.bind(wallet.locker);

            this.setState({ wallet, isPristine: wallet.locker.isPristine() });
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
        const { wallet, isPristine } = this.state;
        const { locker } = wallet;

        // if (locker.isPristine()) {
        //     return <SetupLocker locker={ locker } onComplete={ this.handleSetupLockerComplete } />;
        // }

        const isLocked = locker.isLocked();

        return (
            <div className={ styles.parent }>
                <CSSTransition classNames={ lockscreenClassNames } in={ isLocked }
                    mountOnEnter unmountOnExit timeout={ 1800 }>
                    <LockScreen getLock={ this.getLock } unmounting={ !isLocked } />
                </CSSTransition>
                <WalletContent wallet={ wallet } />
                <SetupLocker locker={ locker } isOpen={ isPristine } onComplete={ this.handleSetupLockerComplete } />
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
        this.setState({ isPristine: this.state.wallet.locker.isPristine() });
    };
}

export default Wallet;
