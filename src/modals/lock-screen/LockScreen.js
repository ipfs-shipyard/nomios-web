import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-web';
import ReactModal from 'react-modal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { PromiseState, getPromiseState } from 'react-promiseful';
import { connectIdmWallet } from 'react-idm-wallet';
import styles from './LockScreen.css';
import unlockAnimationData from './unlock-animation.json';
import backgroundPatternUrl from '../../shared/media/images/background-pattern-1440p.png';

const lockScreenTimeout = {
    appear: 300,
    enter: 300,
    exit: 1600,
};

const lockScreenTransitionClassNames = {
    appearActive: styles.enterActive,
    appearDone: styles.enterDone,
    enterActive: styles.enterActive,
    enterDone: styles.enterDone,
    exit: styles.exit,
    exitActive: styles.exitActive,
    exitDone: styles.exitDone,
};

const passphraseDotsClassNames = {
    enter: styles.enter,
    enterActive: styles.enterActive,
    exit: styles.exit,
    exitActive: styles.exitActive,
};

const unlockAnimationOptions = {
    animationData: unlockAnimationData,
    loop: false,
    autoplay: false,
};

class LockScreen extends Component {
    passphraseInputRef = undefined;

    state = {
        passphrase: '',
        promise: undefined,
        startLogoAnimation: false,
    };

    componentWillUnmount() {
        clearInterval(this.focusInterval);
    }

    render() {
        const { promise, passphrase, startLogoAnimation } = this.state;
        const { in: in_ } = this.props;

        return (
            <ReactModal
                isOpen={ in_ }
                closeTimeoutMS={ lockScreenTimeout.exit }
                className={ styles.modal }
                overlayClassName={ styles.modalOverlay }
                bodyOpenClassName={ styles.modalBodyOpen }>
                <CSSTransition classNames={ lockScreenTransitionClassNames } in={ in_ } appear timeout={ lockScreenTimeout }>
                    <div className={ styles.lockScreen } onClick={ this.handleMouseClick }>
                        <div className={ styles.background } style={ { backgroundImage: `url(${backgroundPatternUrl})` } } />
                        <div className={ styles.content }>
                            <div className={ styles.logo }>
                                <Lottie options={ unlockAnimationOptions } className={ styles.svg } isStopped={ !startLogoAnimation } />
                            </div>
                            <h2 className={ styles.unlockTitle }>Unlock Nomios</h2>
                            <p className={ styles.unlockHint } onTransitionEnd={ this.handleTransitionEnd }>
                                Enter your passphrase to unlock Nomios and get access to all your data
                            </p>

                            <PromiseState promise={ promise }>
                                { ({ status }) => (
                                    <Fragment>
                                        <input
                                            type="password"
                                            className={ styles.passphraseInput }
                                            ref={ this.storePassphraseInputRef }
                                            value={ passphrase }
                                            onKeyDown={ this.handleInputKeyDown }
                                            onChange={ this.handleInputChange }
                                            onBlur={ this.handleInputBlur }
                                            disabled={ status === 'pending' } />
                                        { this.renderPasswordDots(status) }
                                        <p className={ classNames(styles.errorMessage, status === 'rejected' && styles.show) }>
                                            The passphrase you entered does not match the saved passphrase. Please try again.
                                        </p>
                                    </Fragment>
                                ) }
                            </PromiseState>
                        </div>
                    </div>
                </CSSTransition>
            </ReactModal>
        );
    }

    renderPasswordDots(status) {
        const { passphrase } = this.state;

        const passphraseLength = passphrase.length;
        const addDelays = status === 'pending';

        return (
            <div className={ classNames(styles.passphraseDisplay, status === 'rejected' && styles.error) }>
                <TransitionGroup component={ null } appear>
                    {
                        Array(passphraseLength).fill(0)
                        .map((val, i) => (
                            <CSSTransition
                                classNames={ passphraseDotsClassNames }
                                key={ passphraseLength - i }
                                timeout={ 50 }
                                exit={ status !== 'rejected' }>
                                <div
                                    className={ classNames(styles.passphraseDot, status === 'pending' && styles.loading) }
                                    style={ {
                                        animationDelay: addDelays ? `${((0.1 * passphraseLength) - 0.1) - (i / 10)}s` : undefined,
                                    } } />
                            </CSSTransition>
                        ))
                    }
                </TransitionGroup>
                { passphraseLength === 0 && <div className={ styles.cursor } /> }
            </div>
        );
    }

    storePassphraseInputRef = (ref) => {
        this.passphraseInputRef = ref;
        clearInterval(this.focusInterval);

        if (ref) {
            ref.focus();
            this.focusInterval = setInterval(() => ref.focus(), 250);
        }
    };

    submit() {
        // Skip if there's a ongoing promise
        if (getPromiseState(this.state.promise).status !== 'none') {
            return;
        }

        const promise = this.props.unlock('passphrase', this.state.passphrase);

        this.setState({ promise });
    }

    handleInputChange = (event) => {
        const value = event.target.value;

        this.setState(({ promise }) => ({
            // Reset passphrase if there was error
            passphrase: getPromiseState(promise).status === 'rejected' ? value.substr(-1, 1) : value,
            promise: undefined,
        }));
    };

    handleInputKeyDown = (event) => {
        switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'Home':
        case 'Tab':
            event.preventDefault();
            break;
        case 'Enter':
            event.preventDefault();
            this.submit();
            break;
        default:
        }
    };

    handleInputBlur = () => this.passphraseInputRef && this.passphraseInputRef.focus();

    handleMouseClick = () => this.passphraseInputRef && this.passphraseInputRef.focus();

    handleTransitionEnd = () => this.setState({ startLogoAnimation: true });
}

LockScreen.propTypes = {
    unlock: PropTypes.func.isRequired,
    in: PropTypes.bool,
};

export default connectIdmWallet((idmWallet) => {
    const unlock = (type, input) => idmWallet.locker.getLock(type).unlock(input);

    return () => ({
        unlock,
    });
})(LockScreen);
