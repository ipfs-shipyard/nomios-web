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
    }

    render() {
        const { passwordLength, feedback } = this.state;
        const passwordClassName = classNames(
            styles.passwordDot,
            feedback === 'loading' && styles.loading,
            feedback === 'error' && styles.error
        );

        const animationDelay = feedback === 'loading' ? -0.1 : 0;

        return (
            <div className={ styles.lockscreen } onClick={ this.handleMouseClick }>
                <div className={ styles.lockscreenContent }>
                    <div className={ styles.logo }>logo</div>
                    <h2 className={ styles.unlockTitle }>Unlock Nomios</h2>
                    <p className={ styles.unlockHint }>Enter your passphrase to unlock Nomios and get access to all your data</p>
                    <input type="password" name="lockerKey" className={ styles.passwordInput } ref={ this.passwordInputRef } onChange={ this.handlePasswordChange } disabled={ feedback === 'loading' } />
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
                    </div>
                </div>
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
                this.setState({ feedback: 'none' });
            }
            break;
        }
    };

    handleMouseClick = () => {
        console.log('this.passwordInputRef.current', this.passwordInputRef.current);
        this.passwordInputRef.current.focus();
    };

    handleSubmission = () => {
        const { locker } = this.props;
        const password = this.passwordInputRef.current.value;

        locker.getLock(LOCK_TYPE).unlock(password)
        .catch(() => this.setState({ feedback: 'error' }));
    };
}

LockScreen.propTypes = {
    locker: PropTypes.object.isRequired,
};

export default LockScreen;
