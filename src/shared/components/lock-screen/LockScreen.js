import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './LockScreen.css';

const LOCK_TYPE = 'passphrase';

class LockScreen extends Component {
    passwordInputRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            passwordLength: 0,
            feedback: 'none',
        };
    }

    componentDidMount() {
        const input = this.passwordInputRef.current;

        input.focus();
        input.addEventListener('keydown', this.handleKeyboardInput);

        this.mounted = false;
        this.forceUpdate();
    }

    render() {
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
                <CSSTransition classNames={ styles.lockscreenContent } in={ !unmounting } appear component={ null } timeout={ 1000 }>
                    <div className={ styles.lockscreenContent }>
                        <div className={ styles.logo }>logo</div>
                        <h2 className={ styles.unlockTitle }>Unlock Nomios</h2>
                        <p className={ styles.unlockHint }>Enter your passphrase to unlock Nomios and get access to all your data</p>
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
    }

    handlePasswordChange = (event) => {
        this.setState({ passwordLength: event.target.value.length });
    };

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
            if (this.state.feedback === 'none') {
                this.handleSubmission();
            }
            break;
        default:
            if ((event.code.includes('Digit') || event.code.includes('Key') || event.code === 'Backspace') && this.state.feedback === 'error') {
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

    handleMouseClick = () => {
        this.passwordInputRef.current.focus();
    };

    handleSubmission = () => {
        const { getLock } = this.props;
        const password = this.passwordInputRef.current.value;

        this.setState({ feedback: 'loading' });

        getLock(LOCK_TYPE).unlock(password)
        .catch(() => this.setState({ feedback: 'error' }));
    };
}

LockScreen.propTypes = {
    getLock: PropTypes.func.isRequired,
    unmounting: PropTypes.bool,
};

LockScreen.defaultProps = {
    unmounting: false,
};

export default LockScreen;
