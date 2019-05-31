import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import pDelay from 'delay';
import Lottie from 'lottie-react-web';
import ReactModal from 'react-modal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { PromiseState, getPromiseState } from 'react-promiseful';
import { connectIdmWallet } from 'react-idm-wallet';
import backgroundPatternUrl from '../../shared/media/backgrounds/background-pattern-1440p.png';
import unlockAnimationData from './unlock-animation.json';
import styles from './LockScreen.css';

const MINIMUM_UNLOCK_ANIMATION_DURATION = 500;

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
    static getDerivedStateFromProps(props, state) {
        return {
            in: props.locked ? true : state.in,
        };
    }

    passphraseInputRef = undefined;
    focusInterval = undefined;
    focusTimeout = undefined;

    state = {
        in: false,
        passphrase: '',
        promise: undefined,
        startLogoAnimation: false,
    };

    render() {
        const { in: in_, promise, passphrase, startLogoAnimation } = this.state;

        return (
            <ReactModal
                isOpen={ in_ }
                closeTimeoutMS={ lockScreenTimeout.exit }
                className={ styles.modal }
                onAfterClose={ this.handleModalClose }
                overlayClassName={ styles.modalOverlay }
                portalClassName={ styles.modalPortal }
                bodyOpenClassName={ styles.modalBodyOpen }>
                <CSSTransition classNames={ lockScreenTransitionClassNames } in={ in_ } appear timeout={ lockScreenTimeout }>
                    <div className={ styles.lockScreen } onClick={ this.handleMouseClick }>
                        <div className={ styles.background } style={ { backgroundImage: `url(${backgroundPatternUrl})` } } />
                        <div className={ styles.content }>
                            <div className={ styles.logo }>
                                <Lottie options={ unlockAnimationOptions } isStopped={ !startLogoAnimation } />
                            </div>
                            <h2 className={ styles.unlockTitle }>Unlock Nomios</h2>
                            <p className={ styles.unlockHint } onTransitionEnd={ this.handleTransitionEnd }>
                                Enter your passphrase to unlock Nomios and get access to all your data
                            </p>

                            <PromiseState
                                promise={ promise }
                                onSettle={ this.handlePromiseSettle }>
                                { ({ status }) => (
                                    <Fragment>
                                        <input
                                            type="password"
                                            className={ styles.passphraseInput }
                                            ref={ this.storePassphraseInputRef }
                                            value={ passphrase }
                                            onKeyDown={ this.handleInputKeyDown }
                                            onChange={ this.handleInputChange }
                                            onBlur={ this.handleInputBlur } />
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
        const rejected = status === 'rejected';
        const loading = status === 'pending' || status === 'fulfilled';
        const animationDelay = loading ? -0.1 : 0;

        return (
            <div className={ classNames(styles.passphraseDisplay, rejected && styles.error) }>
                <TransitionGroup component={ null } appear>
                    {
                        Array(passphraseLength).fill(0)
                        .map((val, i) => (
                            <CSSTransition
                                classNames={ passphraseDotsClassNames }
                                key={ passphraseLength - i }
                                timeout={ 50 }
                                exit={ !rejected }>
                                <div
                                    className={ classNames(styles.passphraseDot, loading && styles.loading) }
                                    style={ { animationDelay: `${animationDelay * i}s` } } />
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
        clearTimeout(this.focusTimeout);

        if (ref) {
            this.focusTimeout = setTimeout(() => {
                this.passphraseInputRef.focus();
                this.focusInterval = setInterval(() => this.passphraseInputRef.focus(), 250);
            }, lockScreenTimeout.enter + 100);
        }
    };

    submit() {
        // Skip if there's a ongoing promise
        if (getPromiseState(this.state.promise).status !== 'none') {
            return;
        }

        const promise = Promise.all([
            pDelay(MINIMUM_UNLOCK_ANIMATION_DURATION),
            this.props.unlock('passphrase', this.state.passphrase).then(() => this.props.load()),
        ]);

        this.setState({ promise });
    }

    handleModalClose = () => {
        this.setState({
            passphrase: '',
            promise: undefined,
            startLogoAnimation: false,
        });
    };

    handlePromiseSettle = ({ status }) => {
        if (status === 'fulfilled') {
            this.setState({
                in: this.props.locked,
            });
        }
    };

    handleInputChange = (event) => {
        const value = event.target.value;

        this.setState(({ promise }) => {
            const { status } = getPromiseState(promise);

            if (status === 'pending' || status === 'fulfilled') {
                return;
            }

            if (status === 'rejected') {
                return {
                    passphrase: value.substring(value.length - 1),
                    promise: undefined,
                };
            }

            return {
                passphrase: value,
                promise: undefined,
            };
        });
    };

    handleInputKeyDown = (event) => {
        switch (event.key) {
        // Disallow carret change & selection
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'Home':
        case 'Tab':
            event.preventDefault();
            break;
        // Disallow selection of all text
        case 'a':
            if (event.metaKey || event.ctrlKey) {
                event.preventDefault();
            }
            break;
        // Submit!
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
    locked: PropTypes.bool,
    unlock: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
};

export default connectIdmWallet((idmWallet) => {
    const unlock = (type, input) => idmWallet.locker.getLock(type).unlock(input);
    const load = () => idmWallet.identities.load().catch(() => {}); // Error is being displayed underneath

    return () => ({
        locked: idmWallet.locker.isLocked(),
        unlock,
        load,
    });
})(LockScreen);
