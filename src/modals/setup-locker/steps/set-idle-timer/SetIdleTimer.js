import React, { Component, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import { IdlePicker, Button } from '@nomios/web-uikit';
import PropTypes from 'prop-types';
import { ButtonPromiseState, getPromiseState } from '../../../../shared/components/button-promise-state';
import styles from './SetIdleTimer.css';

class SetIdleTimer extends Component {
    buttonRef = createRef();

    state = {
        timeoutValue: 3,
        promise: undefined,
    };

    componentDidMount() {
        findDOMNode(this)
        .querySelector('[tabindex]')
        .focus();
    }

    render() {
        const { timeoutValue, promise } = this.state;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.title }>Setup expiration time.</h2>
                <p>You may tweak the amount of time you are able to use
                 the app before it locks again. You can go have a coffee without any worries.</p>
                <div className={ styles.idlePicker } onKeyUp={ this.handleIdlePickerKeyUp }>
                    <IdlePicker defaultValue={ timeoutValue } onChange={ this.handlePickerChange } />
                </div>
                <div className={ styles.continueButton }>
                    <ButtonPromiseState promise={ promise } onSettle={ this.handleSettle }>
                        { ({ status }) => (
                            <Button ref={ this.buttonRef } onClick={ this.handleContinue } feedback={ status }>Finish</Button>
                        ) }
                    </ButtonPromiseState>
                </div>
            </div>
        );
    }

    handlePickerChange = (value) => {
        this.setState({ timeoutValue: value });
    };

    handleIdlePickerKeyUp = (event) => {
        // Submit if we have the slider focused
        if (event.key === 'Enter') {
            findDOMNode(this.buttonRef.current).click();
        }
    };

    handleContinue = async () => {
        const { timeoutValue, promise: currentPromise } = this.state;
        const { setMaxTime } = this.props;

        // Protect against the user clicking the button several times while we are still saving the change
        if (getPromiseState(currentPromise).status === 'pending') {
            return;
        }

        const promise = setMaxTime(timeoutValue * 60 * 1000);

        this.setState({ promise });
    };

    handleSettle = (state) => {
        if (state.status === 'fulfilled') {
            this.props.onNextStep();
        } else {
            this.setState({ promise: undefined });
        }
    };
}

SetIdleTimer.propTypes = {
    feedback: PropTypes.oneOf(['none', 'loading', 'success', 'error']),
    setMaxTime: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default SetIdleTimer;
