import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './LockScreen.css';

class LockScreen extends Component {
    passwordInputRef = React.createRef();

    state = {
        password: '',
    };

    componentDidMount() {
        const input = this.passwordInputRef.current;

        input.focus();
        input.addEventListener('keydown', this.handleKeyboardInput);
        document.addEventListener('click', this.handleMouseClick);
    }

    render() {
        const passwordClassName = classNames(
            styles.passwordDot
        );

        const currentPasswordRef = this.passwordInputRef.current;

        const passwordLength = currentPasswordRef ? currentPasswordRef.value.length : 0;

        return (
            <div className={ styles.lockscreen }>
                <div className={ styles.lockscreenContent }>
                    <div className={ styles.logo }>logo</div>
                    <h2 className={ styles.unlockTitle }>Unlock Nomios</h2>
                    <p className={ styles.unlockHint }>Enter your passphrase to unlock Nomios and get access to all your data</p>
                    <input type="password" name="lockerKey" className={ styles.passwordInput } ref={ this.passwordInputRef } onChange={ this.handlePasswordChange } />
                    <div className={ styles.passwordDisplay }>
                        {
                            Array(passwordLength).fill(0)
                            .map((val, i) => <div className={ passwordClassName } key={ i } />)
                        }
                    </div>
                </div>
            </div>
        );
    }

    handlePasswordChange = (value) => {
        this.setState({ password: value });
    };

    handleKeyboardInput = (event) => {
        switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'Tab':
            event.preventDefault();
            event.stopPropagation();
            break;
        default:
            break;
        }
    };

    handleMouseClick = () => {
        this.passwordInputRef.current.focus();
    };
}

export default LockScreen;
