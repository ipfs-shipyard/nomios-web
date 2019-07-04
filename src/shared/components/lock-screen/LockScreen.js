import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import scrollbarCompensate from 'scrollbar-compensate';
import pDelay from 'delay';
import Lottie from 'lottie-react-web';
import ReactModal from 'react-modal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { PromiseState, getPromiseState } from 'react-promiseful';
import ActivityDetector from './ActivityDetector';
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

document.addEventListener('DOMContentLoaded', () => {
    scrollbarCompensate([`.${styles.modalBodyOpen}`]);
});

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
        selected: false,
    };

    render() {
        const { restartIdleTimer } = this.props;
        const { in: in_, promise, passphrase, startLogoAnimation } = this.state;

        return (
            <Fragment>
                { restartIdleTimer ? <ActivityDetector onDetect={ restartIdleTimer } /> : null }
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
                            <div className={ styles.background } />
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
                                    { ({ status, value }) => (
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
                                                { status === 'rejected' && value.code === 'UNLOCK_INPUT_MISMATCH' ? 'The passphrase you entered does not match the saved passphrase. Please try again.' : null }
                                                { status === 'rejected' && value.code !== 'UNLOCK_INPUT_MISMATCH' ? value.message : null }
                                            </p>
                                        </Fragment>
                                    ) }
                                </PromiseState>
                            </div>
                        </div>
                    </CSSTransition>
                </ReactModal>
            </Fragment>
        );
    }

    renderPasswordDots(status) {
        const { passphrase, selected } = this.state;

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
                                    className={ classNames(styles.passphraseDot, loading && styles.loading, selected && styles.selected) }
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
            this.props.unlock('passphrase', this.state.passphrase),
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
                in: false,
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
        case 'Escape':
        case 'Tab':
            event.preventDefault();
            break;
        // Disallow selection of all text
        case 'a':
            if (navigator.platform.toLowerCase().indexOf('mac') !== -1) {
                if (event.metaKey) {
                    this.setState({ selected: true });
                }
                if (event.ctrlKey) {
                    event.preventDefault();
                }
            } else if (event.ctrlKey) {
                this.setState({ selected: true });
            }
            break;
        // Submit!
        case 'Enter':
            event.preventDefault();
            this.submit();
            break;
        default:
            this.state.selected && this.setState({ selected: false });
        }
    };

    handleInputBlur = () => this.passphraseInputRef && this.passphraseInputRef.focus();

    handleMouseClick = () => this.passphraseInputRef && this.passphraseInputRef.focus();

    handleTransitionEnd = () => this.setState({ startLogoAnimation: true });
}

LockScreen.propTypes = {
    locked: PropTypes.bool,
    unlock: PropTypes.func.isRequired,
    restartIdleTimer: PropTypes.func,
};

export default LockScreen;
