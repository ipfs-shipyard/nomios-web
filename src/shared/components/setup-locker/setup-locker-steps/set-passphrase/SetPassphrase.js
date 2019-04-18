import React, { Component } from 'react';
import { TextInput, Button } from '@nomios/web-uikit';
import PropTypes from 'prop-types';

import styles from './SetPassphrase.css';

const deriveFeedbackFromStrength = (strength, error) => {
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
            type: 'info',
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

        return {};
    default:
        return {};
    }
};

class SetPassphrase extends Component {
    password = '';
    passwordInputTimeout = undefined;
    confirmation = '';
    confirmationInputTimeout = undefined;

    state = {
        passwordStrength: 0,
        showMatchFeedback: undefined,
        validation: null,
        disableContinue: true,
        lockerSuggestion: null,
        lockerWarning: null,
        goodEnough: false,
        feedback: 'none',
    };

    render() {
        const { passwordStrength, showMatchFeedback, disableContinue, lockerSuggestion, lockerWarning, feedback } = this.state;

        const feedbackMessage = deriveFeedbackFromStrength(passwordStrength, lockerWarning);

        console.log('feedbackMessage', feedbackMessage);

        if (lockerSuggestion != null && lockerWarning == null) {
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
                    onChange={ this.handlePasswordChange } />
                <TextInput className={ styles.confirmationInput }
                    label="Confirm Passphrase"
                    placeholder="Enter passphrase confirmation"
                    type="password"
                    feedback={ confirmationFeedback }
                    lineStrength={ showMatchFeedback === 1 ? 1 : undefined }
                    onChange={ this.handleConfirmationChange } />
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
            <div>
                <div className={ styles.tooltipHeader }>Recomendations:</div>
                <div className={ styles.suggestionList }>
                    { suggestionList.map((elem, index) => <div key={ index }>- { elem.message }</div>) }
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
            this.setState({ disableContinue: true, showMatchFeedback: undefined });

            return;
        }

        if (this.password !== this.confirmation) {
            this.setState({ disableContinue: true, showMatchFeedback: 0 });

            return;
        }

        if (this.state.goodEnough) {
            this.setState({ disableContinue: false, showMatchFeedback: 1 });
        } else {
            this.setState({ disableContinue: true, showMatchFeedback: undefined });
        }
    };

    handleSuccess = (testedPassword, testedConfirmation, result) => {
        if (this.password !== testedPassword || this.confirmation !== testedConfirmation) {
            this.setState({ disableContinue: true });

            return null;
        }

        console.log('result.score', result.score);
        console.log('result.suggestions', result.suggestions);
        console.log('result.warning', result.warning);

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

        console.log('result.score', result.score);
        console.log('result.suggestions', result.suggestions);
        console.log('result.warning', result.warning);

        if (warning != null) {
            this.setState({ passwordStrength: 0, lockerSuggestion: null, lockerWarning: warning, goodEnough: false });
        } else {
            this.setState({ passwordStrength: score, lockerSuggestion: suggestions, lockerWarning: warning, goodEnough: false });
        }
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
        const { onNextStep, enablePassword } = this.props;

        this.setState({ feedback: 'loading' });
        try {
            await enablePassword(this.password);
        } catch {
            this.setState({ feedback: 'error' });

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
