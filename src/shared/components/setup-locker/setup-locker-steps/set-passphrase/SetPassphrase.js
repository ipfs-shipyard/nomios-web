import React, { Component } from 'react';
import { TextInput, Button, FeedbackMessage } from '@nomios/web-uikit';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './SetPassphrase.css';

class SetPassphrase extends Component {
    password = '';
    passwordInputTimeout = undefined;
    confirmation = '';
    confirmationInputTimeout = undefined;

    state = {
        passwordStrength: 0,
        showMatchFeedback: -1,
        validation: null,
        disableContinue: true,
        lockerSuggestion: null,
        lockerWarning: null,
        goodEnough: false,
        feedback: 'none',
        writeErrorCountdown: 2,
    };

    render() {
        const { passwordStrength,
            showMatchFeedback,
            disableContinue,
            lockerSuggestion,
            lockerWarning,
            feedback,
            writeErrorCountdown } = this.state;

        const feedbackMessage = this.deriveFeedbackFromStrength(passwordStrength, lockerWarning);

        if (lockerSuggestion != null && lockerWarning == null && feedbackMessage != null) {
            feedbackMessage.tooltip = this.renderSuggestions(lockerSuggestion);
        }

        const confirmationFeedback = showMatchFeedback === 0 ? {
            message: 'Passwords don\'t match.',
            type: 'error',
        } : null;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.title }>Setup your locker.</h2>
                <p>Please define a passphrase which will be used to encrypt all the data stored in this app.</p>
                <TextInput className={ styles.passwordInput }
                    label="Enter Passphrase"
                    placeholder="Enter your passphrase"
                    type="password"
                    helperText="Minimum of 8 characters"
                    lineStrength={ passwordStrength }
                    lineType="dashed"
                    feedback={ feedbackMessage }
                    onChange={ this.handlePasswordChange }
                    onEnter={ this.handleContinue } />
                <TextInput className={ styles.confirmationInput }
                    label="Confirm Passphrase"
                    placeholder="Enter passphrase confirmation"
                    type="password"
                    feedback={ confirmationFeedback }
                    lineStrength={ showMatchFeedback === 1 ? 1 : -1 }
                    onChange={ this.handleConfirmationChange }
                    onEnter={ this.handleContinue } />
                <FeedbackMessage
                    variant="large"
                    type="error"
                    className={ classNames(styles.writeError, writeErrorCountdown <= 0 && styles.show) }>
                    There was a problem saving your password. Please try again later.
                </FeedbackMessage>
                <div className={ styles.continueButton }>
                    <Button onClick={ this.handleContinue } disabled={ disableContinue } feedback={ feedback } >Continue</Button>
                </div>
            </div>
        );
    }

    renderSuggestions = (suggestionList) => {
        if (suggestionList == null) {
            return null;
        }

        if (suggestionList.length === 1) {
            return (
                <div className={ styles.singleSuggestion }>{ suggestionList[0].message }</div>
            );
        }

        return (
            <div className={ styles.tooltip }>
                <div className={ styles.tooltipHeader }>Recommendations:</div>
                <div className={ styles.suggestionList }>
                    { suggestionList.map((elem, index) => <div key={ index }><span className={ styles.bullet }>• </span>{ elem.message }</div>) }
                </div>
            </div>
        );
    };

    analyzePassword = () => {
        const { analyzePasswordQuality } = this.props;
        const passwordCopy = this.password;
        const confirmationCopy = this.confirmation;

        analyzePasswordQuality(passwordCopy)
        .then((result) => this.handleSuccess(passwordCopy, confirmationCopy, result))
        .catch((error) => this.handleError(passwordCopy, confirmationCopy, error));
    };

    validatePassword = () => {
        if (this.confirmation === '') {
            this.setState({ disableContinue: true, showMatchFeedback: -1 });

            return;
        }

        if (this.password !== this.confirmation) {
            this.setState({ disableContinue: true, showMatchFeedback: 0 });

            return;
        }

        if (this.state.goodEnough) {
            this.setState({ disableContinue: false, showMatchFeedback: 1 });
        } else {
            this.setState({ disableContinue: true, showMatchFeedback: -1 });
        }
    };

    deriveFeedbackFromStrength = (strength, error) => {
        const normalizedStrength = Math.ceil(4 * strength);

        switch (normalizedStrength) {
        case 1:
            return {
                message: 'Poor',
                type: 'info',
            };
        case 2:
            return {
                message: 'Weak',
                type: 'info',
            };
        case 3:
            return {
                message: 'Fair',
            };
        case 4:
            return {
                message: 'Strong',
            };
        case 0:
            if (error != null) {
                return {
                    message: error,
                    type: 'error',
                };
            }

            return null;
        default:
            return null;
        }
    };

    handleSuccess = (testedPassword, testedConfirmation, result) => {
        if (this.password !== testedPassword || this.confirmation !== testedConfirmation) {
            this.setState({ disableContinue: true });

            return null;
        }

        const score = result.score;
        const suggestions = result.suggestions.length !== 0 ? result.suggestions : null;
        const warning = result.warning != null ? result.warning.message : null;

        this.setState({ passwordStrength: score, lockerSuggestion: suggestions, lockerWarning: warning, goodEnough: true });
        this.validatePassword();
    };

    handleError = (testedPassword, testedConfirmation, result) => {
        const score = result.score;
        const suggestions = result.suggestions.length !== 0 ? result.suggestions : null;
        const warning = result.warning != null ? result.warning.message : null;

        if (warning != null) {
            this.setState({ passwordStrength: 0, lockerSuggestion: null, lockerWarning: warning, goodEnough: false });
        } else {
            this.setState({ passwordStrength: score, lockerSuggestion: suggestions, lockerWarning: warning, goodEnough: false });
        }
        this.validatePassword();
    };

    handlePasswordChange = (event) => {
        const { disableContinue } = this.state;

        if (this.passwordInputTimeout != null) {
            clearTimeout(this.passwordInputTimeout);
        }
        this.password = event.target.value;
        !disableContinue && this.setState({ disableContinue: true });

        this.passwordInputTimeout = setTimeout(this.analyzePassword, 400);
    };

    handleConfirmationChange = (event) => {
        const { disableContinue } = this.state;

        if (this.confirmationInputTimeout != null) {
            clearTimeout(this.confirmationInputTimeout);
        }
        this.confirmation = event.target.value;
        !disableContinue && this.setState({ disableContinue: true });

        this.confirmationInputTimeout = setTimeout(this.validatePassword, 400);
    };

    handleContinue = async () => {
        const { writeErrorCountdown, disableContinue } = this.state;
        const { onNextStep, enablePassword } = this.props;

        if (disableContinue) {
            return;
        }

        this.setState({ feedback: 'loading' });
        try {
            await enablePassword(this.password);
        } catch {
            this.setState({ feedback: 'error', writeErrorCountdown: writeErrorCountdown - 1 });

            return;
        }

        onNextStep({ password: this.password });
    };
}

SetPassphrase.propTypes = {
    onNextStep: PropTypes.func.isRequired,
    analyzePasswordQuality: PropTypes.func.isRequired,
    enablePassword: PropTypes.func.isRequired,
};

export default SetPassphrase;
