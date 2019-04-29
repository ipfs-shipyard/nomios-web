import React, { Component } from 'react';
import { IdlePicker, Button } from '@nomios/web-uikit';
import PropTypes from 'prop-types';

import styles from './SetIdleTimer.css';

class SetIdleTimer extends Component {
    state = {
        timeoutValue: 3,
    };

    render() {
        const { timeoutValue, feedback } = this.state;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.title }>Setup expiration time.</h2>
                <p>You may tweak the amount of time you are ablo to use
                 the app before it locks again. You can go have a coffee without any worries.</p>
                <div className={ styles.idlePicker }>
                    <IdlePicker defaultValue={ timeoutValue } onChange={ this.handlePickerChange } />
                </div>
                <div className={ styles.continueButton }>
                    <Button onClick={ this.handleContinue } onFeedbackAnimationEnd={ this.handleButtonAnimationEnd }
                        feedback={ feedback }>Finish</Button>
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

        try {
            await onSetMaxTime(timeoutValue * 60 * 1000);
            this.setState({ feedback: 'success' });
        } catch {
            this.setState({ feedback: 'error' });
        }
    };

    handleButtonAnimationEnd = (isSuccess) => {
        const { onNextStep } = this.props;

        if (isSuccess) {
            onNextStep();
        } else {
            this.setState({ feedback: 'none' });
        }
    };
}

SetIdleTimer.propTypes = {
    feedback: PropTypes.oneOf(['none', 'loading', 'success', 'error']),
    onSetMaxTime: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default SetIdleTimer;
