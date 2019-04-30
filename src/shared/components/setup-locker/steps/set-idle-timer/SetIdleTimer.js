import React, { Component } from 'react';
import { IdlePicker, Button } from '@nomios/web-uikit';
import PropTypes from 'prop-types';
import { PromiseStatus } from 'react-promise-status';
import styles from './SetIdleTimer.css';

class SetIdleTimer extends Component {
    state = {
        timeoutValue: 3,
    };

    render() {
        const { timeoutValue, idleTimerSubmitPromise } = this.state;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.title }>Setup expiration time.</h2>
                <p>You may tweak the amount of time you are ablo to use
                 the app before it locks again. You can go have a coffee without any worries.</p>
                <div className={ styles.idlePicker }>
                    <IdlePicker defaultValue={ timeoutValue } onChange={ this.handlePickerChange } />
                </div>
                <div className={ styles.continueButton }>
                    <PromiseStatus
                        promise={ idleTimerSubmitPromise }
                        statusMap={ { pending: 'loading', fulfilled: 'success', rejected: 'error' } }
                        delayMs="300">
                        { (status) => (
                            <Button onClick={ this.handleContinue } onFeedbackAnimationEnd={ this.handleButtonAnimationEnd }
                                feedback={ status }>Finish</Button>
                        ) }
                    </PromiseStatus>
                </div>
            </div>
        );
    }

    handlePickerChange = (value) => {
        this.setState({ timeoutValue: value });
    };

    handleContinue = async () => {
        const { timeoutValue } = this.state;
        const { onSetMaxTime } = this.props;

        this.setState({ idleTimerSubmitPromise: onSetMaxTime(timeoutValue * 60 * 1000) });
    };

    handleButtonAnimationEnd = (isSuccess) => {
        const { onNextStep } = this.props;

        if (isSuccess) {
            onNextStep();
        }
    };
}

SetIdleTimer.propTypes = {
    feedback: PropTypes.oneOf(['none', 'loading', 'success', 'error']),
    onSetMaxTime: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default SetIdleTimer;
