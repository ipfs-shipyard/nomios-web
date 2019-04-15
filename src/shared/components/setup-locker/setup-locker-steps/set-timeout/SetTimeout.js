import React, { Component } from 'react';
import { IdlePicker, Button } from '@nomios/web-uikit';
import PropTypes from 'prop-types';

import styles from './SetTimeout.css';

class SetTimeout extends Component {
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
                    <IdlePicker defaultValue={ timeoutValue } handlePickerChange={ this.onPickerChange } />
                </div>
                <div className={ styles.continueButton }>
                    <Button onClick={ this.handleContinue } onAnimationEnd={ this.handleButtonAnimationEnd }
                        feedback={ feedback }>Finish</Button>
                </div>
            </div>
        );
    }

    onPickerChange = (value) => {
        this.setState({ timeoutValue: value });
    };

    handleContinue = async () => {
        const { timeoutValue } = this.state;
        const { setMaxTime } = this.props;

        try {
            await setMaxTime(timeoutValue * 60 * 1000);
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

SetTimeout.propTypes = {
    onNextStep: PropTypes.func.isRequired,
    feedback: PropTypes.oneOf(['none', 'loading', 'success', 'error']),
    setMaxTime: PropTypes.func.isRequired,
};

export default SetTimeout;
