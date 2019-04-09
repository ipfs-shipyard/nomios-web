import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-web';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './LockScreen.css';
import animation from '../../media/animations/unlock-animation.json';
import background from '../../media/images/background-pattern.svg';

const LOCK_TYPE = 'passphrase';

const lockscreenContentClassNames = {
    appear: styles.lockscreenContentAppear,
    appearActive: styles.lockscreenContentAppearActive,
    exit: styles.lockscreenContentExit,
    exitActive: styles.lockscreenContentExitActive,
    exitDone: styles.lockscreenContentExitDone,
};

const passwordDotsClassNames = {
    enter: styles.passwordDotEnter,
    enterActive: styles.passwordDotEnterActive,
    exit: styles.passwordDotExit,
    exitActive: styles.passwordDotExitActive,
};

class LockScreen extends Component {
    passwordInputRef = React.createRef();
    animationOptions = {
        animationData: animation,
        loop: false,
    };

    state = {
        passwordLength: 0,
        feedback: 'none',
        startLogoAnimation: false,
    };

    componentDidMount() {
        const input = this.passwordInputRef.current;

        input.focus();
        input.addEventListener('keydown', this.handleKeyboardInput);
        input.addEventListener('blur', () => input.focus());
    }

    render() {
        const { feedback, startLogoAnimation } = this.state;
        const { unmounting } = this.props;

        return (
            <div className={ styles.lockscreen } onClick={ this.handleMouseClick }>
                <div className={ styles.background } dangerouslySetInnerHTML={ { __html: background } } />
                <CSSTransition classNames={ lockscreenContentClassNames } in={ !unmounting } appear component={ null } timeout={ 1500 }>
                    <div className={ styles.lockscreenContent }>
                        <div className={ styles.logo }>
                            <Lottie options={ this.animationOptions } className={ styles.svg } isPaused={ !startLogoAnimation } />
                        </div>
                        <h2 className={ styles.unlockTitle }>Unlock Nomios</h2>
                        <p className={ styles.unlockHint } onTransitionEnd={ this.handleTransitionEnd }>
                            Enter your passphrase to unlock Nomios and get access to all your data
                        </p>
                        <input type="password"
                            name="getLockKey"
                            className={ styles.passwordInput }
                            ref={ this.passwordInputRef }
                            onChange={ this.handlePasswordChange }
                            disabled={ feedback === 'loading' } />
                        { this.renderPasswordDots() }
                        { feedback === 'error' &&
                            <p className={ styles.errorMessage }>
                                The passphrase you entered does not match the saved passphrase. Please try again.
                            </p>
                        }
                    </div>
                </CSSTransition>
            </div>
        );
    }

    renderPasswordDots = () => {
        const { passwordLength, feedback } = this.state;
        const { unmounting } = this.props;
        const passwordClassName = classNames(
            styles.passwordDot,
            feedback === 'loading' && styles.loading,
            feedback === 'error' && styles.error
        );

        const animationDelay = feedback === 'loading' ? -0.1 : 0;

        return (
            <div className={ styles.lockscreen } onClick={ this.handleMouseClick }>
                <div className={ styles.background } dangerouslySetInnerHTML={ { __html: background } } />
                <CSSTransition classNames={ styles.lockscreenContent } in={ !unmounting } appear component={ null } timeout={ 1500 }>
                    <div className={ styles.lockscreenContent }>
                        <div className={ styles.logo }>
                            <Lottie options={ this.animationOptions } className={ styles.svg } isPaused={ !startLogoAnimation } />
                        </div>
                        <h2 className={ styles.unlockTitle }>Unlock Nomios</h2>
                        <p className={ styles.unlockHint } onTransitionEnd={ this.handleTransitionEnd }>Enter your passphrase to unlock Nomios and get access to all your data</p>
                        <input type="password" name="getLockKey" className={ styles.passwordInput } ref={ this.passwordInputRef } onChange={ this.handlePasswordChange } disabled={ feedback === 'loading' } />
                        <div className={ styles.passwordDisplay }>
                            <TransitionGroup component={ null }>
                                {
                                    Array(passwordLength).fill(0)
                                    .map((val, i) => (
                                        <CSSTransition classNames={ styles.passwordDot } key={ passwordLength - i } component={ null } timeout={ 50 }>
                                            <div className={ passwordClassName } style={ { animationDelay: `${animationDelay * i}s` } } />
                                        </CSSTransition>
                                    ))
                                }
                            </TransitionGroup>
                            { passwordLength === 0 &&
                                <div className={ styles.cursor } />
                            }
                        </div>
                        { feedback === 'error' && <p className={ styles.errorMessage }>The passphrase you entered does not match the saved passphrase. Please try again.</p> }
                    </div>
                </CSSTransition>
            </div>
        );
    };

    handlePasswordChange = (event) => this.setState({ passwordLength: event.target.value.length });

    handleKeyboardInput = (event) => {
        switch (event.code) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'Tab':
            event.preventDefault();
            event.stopPropagation();
            break;
        case 'Enter':
            event.preventDefault();
            event.stopPropagation();
            if (this.state.feedback === 'none') {
                this.handleSubmission();
            }
            this.passwordInputRef.current.focus();
            break;
        default:
            if ((event.code.includes('Digit') || event.code.includes('Key') || event.code === 'Backspace') &&
                this.state.feedback === 'error') {
                this.passwordInputRef.current.value = '';

                if (event.code === 'Backspace') {
                    this.setState({ passwordLength: event.target.value.length, feedback: 'none' });
                } else {
                    this.setState({ feedback: 'none' });
                }
            }
            break;
        }
    };

    handleMouseClick = () => this.passwordInputRef.current.focus();

    handleSubmission = () => {
        const { getLock } = this.props;
        const password = this.passwordInputRef.current.value;

        this.setState({ feedback: 'loading' });

        getLock(LOCK_TYPE).unlock(password)
        .catch(() => this.setState({ feedback: 'error' }));
    };

    handleTransitionEnd = () => this.setState({ startLogoAnimation: true });
}

LockScreen.propTypes = {
    getLock: PropTypes.func.isRequired,
    unmounting: PropTypes.bool,
};

LockScreen.defaultProps = {
    unmounting: false,
};

export default LockScreen;
